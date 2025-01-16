import { useFormContext } from "react-hook-form";
import { formatCurrency } from "../../../utils/helpers";
import styled from "styled-components";
import Checkbox from "../../../ui/Checkbox";
import { useEffect } from "react";
import { calcNewBookingFields } from "./bookingFormHelpers";
import { Error } from "../../../ui/FormRow";

const Box = styled.div`
  /* Box */
  background-color: var(--color-blue-100);
  border: 1px solid var(--color-blue-100);
  border-radius: var(--border-radius-md);
  padding: 2.4rem 4rem;
  margin: 2.4rem 0;
`;

const ErrorContainer = styled.div`
  margin-top: 5px;
`;

function PaymentConfirmation({ isEdit, booking, cabins, settings }) {
  const { getValues, register, setValue, watch, formState } = useFormContext();
  const formData = getValues();
  const { errors } = formState;
  const cabin = cabins.find((cabin) => cabin.id === Number(formData.cabinId));
  const newBooking = calcNewBookingFields(formData, cabin, settings);

  watch(["cabinId", "numGuests", "startDate", "endDate", "hasBreakfast"]);

  useEffect(() => {
    if (isEdit && booking.isPaid) {
      setValue("isPaid", booking.totalPrice === newBooking.totalPrice);
    }
  }, [
    isEdit,
    booking?.totalPrice,
    booking?.isPaid,
    newBooking?.totalPrice,
    setValue,
  ]);

  return (
    <>
      {!isEdit && newBooking?.cabinId && (
        <Box>
          <Checkbox id="isPaid" {...register("isPaid")}>
            I confirm that the guest has paid the total amount of{" "}
            {!newBooking.hasBreakfast
              ? formatCurrency(newBooking.totalPrice)
              : `${formatCurrency(newBooking.totalPrice)}(${formatCurrency(
                  newBooking.cabinPrice
                )} +
                  ${formatCurrency(newBooking.extrasPrice)}) `}
          </Checkbox>
        </Box>
      )}

      {isEdit && newBooking?.cabinId && (
        <Box>
          <Checkbox
            id="isPaid"
            {...register("isPaid", {
              required: "This field is required",
            })}
          >
            {newBooking.totalPrice === booking.totalPrice &&
              `I confirm that the guest has paid the total amount of ${
                !newBooking.hasBreakfast
                  ? formatCurrency(newBooking.totalPrice)
                  : `${formatCurrency(newBooking.totalPrice)}(${formatCurrency(
                      newBooking.cabinPrice
                    )} +
                  ${formatCurrency(newBooking.extrasPrice)}) `
              }`}

            {newBooking.totalPrice > booking.totalPrice &&
              `I confirm that the guest has paid the additional amount of ${formatCurrency(
                newBooking.totalPrice - booking.totalPrice
              )}(${formatCurrency(newBooking.totalPrice)} - ${formatCurrency(
                booking.totalPrice
              )})`}

            {newBooking.totalPrice < booking.totalPrice &&
              `I confirm that the hotel has returned the amount of ${formatCurrency(
                booking.totalPrice - newBooking.totalPrice
              )}(
                ${formatCurrency(booking.totalPrice)} -
                  ${formatCurrency(newBooking.totalPrice)}
              )`}
          </Checkbox>
          <ErrorContainer>
            {errors?.isPaid?.message && (
              <Error>{errors?.isPaid?.message}</Error>
            )}
          </ErrorContainer>
        </Box>
      )}
    </>
  );
}

export default PaymentConfirmation;
