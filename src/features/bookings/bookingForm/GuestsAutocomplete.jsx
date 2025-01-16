import { Controller, useFormContext, useFormState } from "react-hook-form";
import FormRow from "../../../ui/FormRow";
import { useGuestsAutocomplete } from "./useGuestsAutocomplete";
import Autocomplete from "../../../ui/Autocomplete";

function GuestsAutocomplete({ defaultValue, isLoading }) {
  const { control } = useFormContext();
  const { errors } = useFormState();

  const { guests, isLoadingGuests, setGuestQuery } = useGuestsAutocomplete("");

  return (
    <FormRow label="Guest" error={errors?.guestId?.message}>
      <Controller
        control={control}
        name="guestId"
        render={({ field: { onChange, onBlur, ref } }) => (
          <Autocomplete
            isLoading={isLoadingGuests}
            onBlur={onBlur}
            results={guests?.map((guest) => ({
              value: guest.id,
              label: guest.fullName,
            }))}
            onChange={setGuestQuery}
            onSelect={(e) => onChange(e.value)}
            inputRef={ref}
            defaultValue={defaultValue}
            disabled={isLoading}
          />
        )}
      />
    </FormRow>
  );
}

export default GuestsAutocomplete;
