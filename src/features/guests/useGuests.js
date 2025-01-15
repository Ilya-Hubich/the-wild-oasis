import { useQuery } from "@tanstack/react-query";
import { getGuests } from "../../services/apiGuests";

export function useGuests({ filter, options }) {
  const { isLoading: isLoadingGuests, data: guests } = useQuery({
    queryKey: ["guests", filter],
    queryFn: () => getGuests({ filter }),
    ...options,
  });

  return { isLoadingGuests, guests };
}
