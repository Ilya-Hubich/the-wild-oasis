import { useFormContext, useWatch, useFormState } from "react-hook-form";
import FormRow from "../../../ui/FormRow";
import Input from "../../../ui/Input";

function NumGuests({ isLoading, cabins }) {
  const { register } = useFormContext();
  const { errors } = useFormState();
  const cabinId = useWatch({ name: "cabinId" });
  const cabin = cabins.find((cabin) => cabin.id === Number(cabinId));

  return (
    <FormRow label="Number of guests" error={errors?.numGuests?.message}>
      <Input
        type="number"
        id="numGuests"
        disabled={isLoading}
        {...register("numGuests", {
          required: "This field is required",
          valueAsNumber: true,
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
  );
}

export default NumGuests;
