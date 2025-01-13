import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateBooking as updateBookingApi } from "../../services/apiBookings";
import toast from "react-hot-toast";

export function useUpdateBooking() {
  const queryClient = useQueryClient();

  const { isLoading, mutate: updateBooking } = useMutation({
    mutationFn: (booking) => {
      return updateBookingApi(booking.id, booking);
    },
    onSuccess: (booking) => {
      toast.success(`Booking #${booking.id} successfully updated`);
      queryClient.invalidateQueries(["bookings"]);
    },
    onError: (err) => toast.error(err.message),
  });

  return { isLoading, updateBooking };
}
