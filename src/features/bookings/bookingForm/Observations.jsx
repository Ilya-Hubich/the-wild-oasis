import { useFormContext, useFormState } from "react-hook-form";
import FormRow from "../../../ui/FormRow";
import Textarea from "../../../ui/Textarea";

function Observations({ isLoading }) {
  const { register } = useFormContext();
  const { errors } = useFormState();

  return (
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
  );
}

export default Observations;
