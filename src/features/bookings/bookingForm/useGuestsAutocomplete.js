import { useState } from "react";
import { useGuests } from "../../guests/useGuests";

export function useGuestsAutocomplete(initialValue, minQueryLength = 3) {
  const [guestQuery, setGuestQuery] = useState(initialValue);

  const { guests, isLoadingGuests } = useGuests({
    filter: {
      method: "ilike",
      field: "fullName",
      value: `%${guestQuery}%`,
    },
    options: { enabled: guestQuery?.length >= minQueryLength },
  });

  return { guests, isLoadingGuests, setGuestQuery };
}
