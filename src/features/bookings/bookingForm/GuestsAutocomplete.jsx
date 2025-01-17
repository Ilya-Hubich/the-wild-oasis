import { Controller, useFormContext, useFormState } from "react-hook-form";
import FormRow from "../../../ui/FormRow";
import { useGuestsAutocomplete } from "./useGuestsAutocomplete";
import Autocomplete from "../../../ui/Autocomplete";
import { Flag } from "../../../ui/Flag";
import styled from "styled-components";

const ResultItem = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
`;

function GuestsAutocomplete({ defaultValue, isLoading }) {
  const { control } = useFormContext();
  const { errors } = useFormState();

  const { guests, isLoadingGuests, setGuestQuery } = useGuestsAutocomplete("");

  return (
    <FormRow label="Guest" error={errors?.guestId?.message}>
      <Controller
        control={control}
        name="guestId"
        render={({ field: { onChange, onBlur, ref, disabled } }) => (
          <Autocomplete
            isLoading={isLoadingGuests}
            onBlur={onBlur}
            results={guests}
            renderResults={(guest) => (
              <ResultItem>
                <Flag
                  src={guest.countryFlag}
                  alt={`Flag of ${guest.country}`}
                />
                <span>{guest.fullName}</span>
              </ResultItem>
            )}
            getLabel={(guest) => guest.fullName}
            onChange={setGuestQuery}
            onSelect={(guest) => onChange(guest?.id)}
            inputRef={ref}
            defaultValue={defaultValue}
            disabled={disabled}
          />
        )}
        rules={{ required: "This field is required" }}
      />
    </FormRow>
  );
}

export default GuestsAutocomplete;
