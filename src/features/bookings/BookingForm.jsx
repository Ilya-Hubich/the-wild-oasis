import { useForm } from "react-hook-form";
import styled from "styled-components";
import {
  addDays,
  differenceInCalendarDays,
  format,
  isBefore,
  isSameDay,
} from "date-fns";
import Form from "../../ui/Form";
import FormRow from "../../ui/FormRow";
import Input from "../../ui/Input";
import Button from "../../ui/Button";
import Checkbox from "../../ui/Checkbox";
import Textarea from "../../ui/Textarea";
import Select from "../../ui/Select";
import { formatCurrency } from "../../utils/helpers";
import { useEffect } from "react";

const Box = styled.div`
  /* Box */
  background-color: var(--color-blue-100);
  border: 1px solid var(--color-blue-100);
  border-radius: var(--border-radius-md);
  padding: 2.4rem 4rem;
  margin: 2.4rem 0;
`;

function calcNewBookingFields(newBooking, cabin, settings) {
  if (!newBooking?.cabinId) return {};

  const cabinId = Number(newBooking.cabinId);
  const numGuests = Number(newBooking.numGuests);

  const numNights = differenceInCalendarDays(
    new Date(newBooking.endDate),
    new Date(newBooking.startDate)
  );

  const cabinPrice = numNights * (cabin.regularPrice - cabin.discount);

  const extrasPrice = newBooking.hasBreakfast
    ? numGuests * settings.breakfastPrice * numNights
    : 0;

  return {
    ...newBooking,
    numGuests,
    cabinId,
    numNights,
    cabinPrice,
    extrasPrice,
    totalPrice: cabinPrice + extrasPrice,
  };
}

function isBeforeOrSameDay(date1, date2) {
  return isBefore(date1, date2) || isSameDay(date1, date2);
}

function BookingForm({
  booking,
  isLoading,
  cabins,
  settings,
  onSubmit,
  onCancel,
}) {
  const isEdit = Boolean(booking);

  const defaultValues = isEdit
    ? {
        guestId: booking.guestId,
        cabinId: booking.cabinId,
        numGuests: booking.numGuests,
        numNights: booking.numNights,
        observations: booking.observations,
        isPaid: booking.isPaid,
        startDate: format(new Date(booking.startDate), "yyyy-MM-dd"),
        endDate: format(addDays(new Date(booking.endDate), 1), "yyyy-MM-dd"),
      }
    : {
        guestId: "",
        cabinId: cabins[0].id,
        numGuests: 1,
        numNights: 1,
        observations: "",
        isPaid: false,
        startDate: format(new Date(), "yyyy-MM-dd"),
        endDate: format(addDays(new Date(), 1), "yyyy-MM-dd"),
      };

  const { register, formState, handleSubmit, watch, setValue, getValues } =
    useForm({
      defaultValues,
    });

  const { errors } = formState;

  watch(["cabinId", "numGuests", "startDate", "endDate", "hasBreakfast"]);
  const formData = getValues();
  const cabin = cabins.find((cabin) => cabin.id === Number(formData.cabinId));
  const newBooking = calcNewBookingFields(formData, cabin, settings);

  const minStartDate = format(new Date(), "yyyy-MM-dd");
  const minEndDate = format(
    addDays(
      newBooking.startDate ? new Date(newBooking.startDate) : new Date(),
      1
    ),
    "yyyy-MM-dd"
  );

  useEffect(() => {
    if (
      isBeforeOrSameDay(
        new Date(newBooking.endDate),
        new Date(newBooking.startDate)
      )
    ) {
      setValue(
        "endDate",
        format(addDays(new Date(newBooking.startDate), 1), "yyyy-MM-dd")
      );
    }
  }, [newBooking.startDate, newBooking.endDate, setValue]);

  useEffect(() => {
    if (isEdit && booking.isPaid) {
      if (
        booking.totalPrice >= newBooking.totalPrice &&
        newBooking.isPaid === false
      )
        setValue("isPaid", true);
      if (
        booking.totalPrice < newBooking.totalPrice &&
        newBooking.isPaid === true
      )
        setValue("isPaid", false);
    }
  }, [
    isEdit,
    booking.totalPrice,
    booking.isPaid,
    newBooking.totalPrice,
    newBooking.isPaid,
    setValue,
  ]);

  function innerOnSubmit(data) {
    onSubmit(calcNewBookingFields(data, cabin, settings));
  }

  return (
    <Form onSubmit={handleSubmit(innerOnSubmit)}>
      <FormRow label="Guest Id" error={errors?.guestId?.message}>
        <Input
          type="number"
          id="guestId"
          disabled={isLoading}
          {...register("guestId", {
            required: "This field is required",
          })}
        />
      </FormRow>

      <FormRow label="Cabin" error={errors?.cabinId?.message}>
        <Select
          id="cabinId"
          disabled={isLoading}
          {...register("cabinId", {
            required: "This field is required",
          })}
          options={cabins.map((cabin) => ({
            value: cabin.id,
            label: cabin.name,
          }))}
        ></Select>
      </FormRow>

      <FormRow label="Number of guests" error={errors?.numGuests?.message}>
        <Input
          type="number"
          id="numGuests"
          disabled={isLoading}
          {...register("numGuests", {
            required: "This field is required",
            min: {
              value: 1,
              message: "Minimum 1 guest",
            },
            max: {
              value: cabin.maxCapacity,
              message: `Cabin's max capacity is ${cabin.maxCapacity}`,
            },
          })}
        />
      </FormRow>

      <FormRow label="Start date" error={errors?.startDate?.message}>
        <Input
          type="date"
          id="startDate"
          disabled={isLoading}
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
          disabled={isLoading}
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

      <FormRow label="Breakfast">
        <Checkbox
          id="hasBreakfast"
          disabled={isLoading}
          {...register("hasBreakfast")}
        />
      </FormRow>

      <FormRow label="Observations" error={errors?.observations?.message}>
        <Textarea
          id="observations"
          disabled={isLoading}
          {...register("observations", {
            maxLength: {
              value: 1000,
              message: "Max Length is 1000",
            },
          })}
        />
      </FormRow>

      {!isEdit && newBooking?.cabinId && (
        <Box>
          <Checkbox id="isPaid" {...register("isPaid")}>
            I confirm that the guest has paid the total amount of{" "}
            {!newBooking.hasBreakfast
              ? formatCurrency(newBooking.totalPrice)
              : `${formatCurrency(newBooking.totalPrice)}(${formatCurrency(
                  newBooking.cabinPrice
                )} +
                  ${formatCurrency(newBooking.extrasPrice)}) `}
          </Checkbox>
        </Box>
      )}

      {isEdit && newBooking?.cabinId && (
        <Box>
          <Checkbox id="isPaid" {...register("isPaid")}>
            {newBooking.totalPrice > booking.totalPrice &&
              `I confirm that the guest has paid the additional amount of ${formatCurrency(
                newBooking.totalPrice - booking.totalPrice
              )}(${formatCurrency(newBooking.totalPrice)} - ${formatCurrency(
                booking.totalPrice
              )})`}

            {newBooking.totalPrice < booking.totalPrice &&
              `I confirm that the hotel has returned the amount of ${formatCurrency(
                booking.totalPrice - newBooking.totalPrice
              )}(
                ${formatCurrency(booking.totalPrice)} -
                  ${formatCurrency(newBooking.totalPrice)}
              )`}
          </Checkbox>
        </Box>
      )}

      <FormRow>
        {/* type is an HTML attribute! */}
        <Button variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button disabled={isLoading}>
          {isEdit ? "Edit Booking" : "Create new booking"}
        </Button>
      </FormRow>
    </Form>
  );
}

export default BookingForm;
