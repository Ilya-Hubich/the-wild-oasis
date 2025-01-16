import { FormProvider, useForm } from "react-hook-form";
import Form from "../../../ui/Form";
import FormRow from "../../../ui/FormRow";
import Button from "../../../ui/Button";
import GuestsAutocomplete from "./GuestsAutocomplete";
import StartEndDates from "./StartEndDates";
import PaymentConfirmation from "./PaymentConfirmation";
import { calcNewBookingFields, getDefaultValues } from "./bookingFormHelpers";
import NumGuests from "./NumGuests";
import CabinsSelect from "./CabinsSelect";
import Breakfast from "./Breakfast";
import Observations from "./Observations";
// import { DevTool } from "@hookform/devtools";

function BookingForm({
  booking,
  isLoading,
  cabins,
  settings,
  onSubmit,
  onCancel,
}) {
  const isEdit = Boolean(booking);

  const defaultValues = getDefaultValues(isEdit, booking, cabins);

  const form = useForm({
    defaultValues,
  });

  const { handleSubmit /*,control*/ } = form;

  function innerOnSubmit(data) {
    const cabin = cabins.find((cabin) => cabin.id === Number(data.cabinId));
    onSubmit(calcNewBookingFields(data, cabin, settings));
  }

  return (
    <FormProvider {...form}>
      <Form onSubmit={handleSubmit(innerOnSubmit)} noValidate>
        <GuestsAutocomplete
          defaultValue={booking?.guests.fullName}
          disabled={isLoading}
        />

        <CabinsSelect isLoading={isLoading} cabins={cabins} />

        <NumGuests isLoading={isLoading} cabins={cabins} />

        <StartEndDates settings={settings} isLoading={isLoading} />

        <Breakfast isLoading={isLoading} />

        <Observations isLoading={isLoading} />

        <PaymentConfirmation
          isEdit={isEdit}
          booking={booking}
          cabins={cabins}
          settings={settings}
        />

        <FormRow>
          {/* type is an HTML attribute! */}
          <Button variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
          <Button disabled={isLoading}>
            {/* TODO: || (isEdit && booking.isPaid && !newBooking.isPaid) */}
            {isEdit ? "Edit Booking" : "Create new booking"}
          </Button>
        </FormRow>
      </Form>

      {/* <DevTool control={control} /> */}
    </FormProvider>
  );
}

export default BookingForm;
