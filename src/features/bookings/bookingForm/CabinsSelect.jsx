import { useFormContext, useFormState } from "react-hook-form";
import FormRow from "../../../ui/FormRow";
import Select from "../../../ui/Select";

function CabinsSelect({ isLoading, cabins }) {
  const { register } = useFormContext();
  const { errors } = useFormState();

  return (
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
  );
}

export default CabinsSelect;
