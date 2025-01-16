import { useFormContext } from "react-hook-form";
import Checkbox from "../../../ui/Checkbox";
import FormRow from "../../../ui/FormRow";

function Breakfast({ isLoading }) {
  const { register } = useFormContext();

  return (
    <FormRow label="Breakfast">
      <Checkbox
        id="hasBreakfast"
        disabled={isLoading}
        {...register("hasBreakfast")}
      />
    </FormRow>
  );
}

export default Breakfast;
