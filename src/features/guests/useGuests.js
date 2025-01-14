import { useQuery } from "@tanstack/react-query";
import { getGuests } from "../../services/apiGuests";

export function useGuests({ filter }) {
  const { isLoading: isLoadingGuests, data: guests } = useQuery({
    queryKey: ["guests", filter],
    queryFn: () => getGuests({ filter }),
  });

  return { isLoadingGuests, guests };
}
