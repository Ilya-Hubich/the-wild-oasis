import { useFormContext, useFormState, useWatch } from "react-hook-form";
import FormRow from "../../../ui/FormRow";
import Input from "../../../ui/Input";
import {
  addDays,
  differenceInCalendarDays,
  format,
  isBefore,
  isSameDay,
} from "date-fns";
import { useEffect } from "react";

function isBeforeOrSameDay(date1, date2) {
  return isBefore(date1, date2) || isSameDay(date1, date2);
}

function StartEndDates({ settings }) {
  const { register, getValues, setValue } = useFormContext();
  const { errors } = useFormState();

  const [startDate, endDate] = useWatch({
    name: ["startDate", "endDate"],
  });

  const minStartDate = format(new Date(), "yyyy-MM-dd");
  const minEndDate = format(
    addDays(startDate ? new Date(startDate) : new Date(), 1),
    "yyyy-MM-dd"
  );

  useEffect(() => {
    if (isBeforeOrSameDay(new Date(endDate), new Date(startDate))) {
      setValue(
        "endDate",
        format(addDays(new Date(startDate), 1), "yyyy-MM-dd")
      );
    }
  }, [startDate, endDate, setValue]);

  return (
    <>
      <FormRow label="Start date" error={errors?.startDate?.message}>
        <Input
          type="date"
          id="startDate"
          min={minStartDate}
          {...register("startDate", {
            required: "This field is required",
          })}
        />
      </FormRow>

      <FormRow label="End date" error={errors?.endDate?.message}>
        <Input
          type="date"
          id="endDate"
          min={minEndDate}
          {...register("endDate", {
            required: "This field is required",
            validate: (endDate) => {
              const diff = differenceInCalendarDays(
                new Date(endDate),
                new Date(getValues().startDate)
              );

              if (diff < settings.minBookingLength)
                return `Minimum booking length is ${settings.minBookingLength} days`;

              if (diff > settings.maxBookingLength)
                return `Maximum booking length is ${settings.maxBookingLength} days`;
            },
          })}
        />
      </FormRow>
    </>
  );
}

export default StartEndDates;
