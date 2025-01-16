import { addDays, differenceInCalendarDays, format } from "date-fns";

export function getDefaultValues(isEdit, booking, cabins) {
  return isEdit
    ? {
        guestId: booking.guestId,
        cabinId: booking.cabinId,
        numGuests: booking.numGuests,
        numNights: booking.numNights,
        hasBreakfast: booking.hasBreakfast,
        observations: booking.observations,
        isPaid: booking.isPaid,
        startDate: format(new Date(booking.startDate), "yyyy-MM-dd"),
        endDate: format(new Date(booking.endDate), "yyyy-MM-dd"),
      }
    : {
        guestId: "",
        cabinId: cabins[0].id,
        numGuests: 1,
        numNights: 1,
        hasBreakfast: false,
        observations: "",
        isPaid: false,
        startDate: format(new Date(), "yyyy-MM-dd"),
        endDate: format(addDays(new Date(), 1), "yyyy-MM-dd"),
      };
}

export function calcNewBookingFields(newBooking, cabin, settings) {
  if (!newBooking?.cabinId) return {};

  const cabinId = Number(newBooking.cabinId);
  const numGuests = Number(newBooking.numGuests);

  const numNights = differenceInCalendarDays(
    new Date(newBooking.endDate),
    new Date(newBooking.startDate)
  );

  const cabinPrice = numNights * (cabin.regularPrice - cabin.discount);

  const extrasPrice = newBooking.hasBreakfast
    ? numGuests * settings.breakfastPrice * numNights
    : 0;

  return {
    ...newBooking,
    numGuests,
    cabinId,
    numNights,
    cabinPrice,
    extrasPrice,
    totalPrice: cabinPrice + extrasPrice,
  };
}
