import { useNavigate, useParams } from "react-router-dom";
import { useCabins } from "../cabins/useCabins";
import { useSettings } from "../settings/useSettings";
import Spinner from "../../ui/Spinner";
import BookingForm from "./bookingForm/BookingForm";
import { useUpdateBooking } from "./useUpdateBooking";
import { useBooking } from "./useBooking";

function EditBooking() {
  const { bookingId } = useParams();

  const { booking, isLoading: isLoadingBooking } = useBooking(bookingId);
  const { isLoading: isLoadingCabins, cabins } = useCabins();
  const { isLoading: isLoadingSettings, settings } = useSettings();
  const { isLoading, updateBooking } = useUpdateBooking();
  const navigate = useNavigate();

  if (isLoadingBooking || isLoadingCabins || isLoadingSettings)
    return <Spinner />;

  function onSubmit(data) {
    updateBooking(
      { ...data, id: booking.id },
      {
        onSuccess: (data) => {
          navigate(`/bookings/${data.id}`, { replace: true });
        },
      }
    );
  }

  return (
    <BookingForm
      booking={booking}
      isLoading={isLoading}
      cabins={cabins}
      settings={settings}
      onSubmit={onSubmit}
      onCancel={() => navigate("/bookings")}
    ></BookingForm>
  );
}

export default EditBooking;
