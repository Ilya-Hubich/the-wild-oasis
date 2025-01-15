import BookingForm from "./bookingForm/BookingForm";
import { useCreateBooking } from "./useCreateBooking";
import { useCabins } from "../cabins/useCabins";
import { useSettings } from "../settings/useSettings";
import Spinner from "../../ui/Spinner";
import { useNavigate } from "react-router-dom";

function AddBooking() {
  const { isLoading: isLoadingCabins, cabins } = useCabins();
  const { isLoading: isLoadingSettings, settings } = useSettings();
  const { isLoading, createBooking } = useCreateBooking();
  const navigate = useNavigate();

  if (isLoadingCabins || isLoadingSettings) return <Spinner />;

  function onSubmit(data) {
    createBooking(data, {
      onSuccess: (data) => {
        navigate(`/bookings/${data.id}`, { replace: true });
      },
    });
  }

  return (
    <BookingForm
      isLoading={isLoading}
      cabins={cabins}
      settings={settings}
      onSubmit={onSubmit}
      onCancel={() => navigate("/bookings")}
    ></BookingForm>
  );
}

export default AddBooking;
