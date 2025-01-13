import styled from "styled-components";
import BookingDataBox from "../../features/bookings/BookingDataBox";

import Row from "../../ui/Row";
import Heading from "../../ui/Heading";
import ButtonGroup from "../../ui/ButtonGroup";
import Button from "../../ui/Button";
import ButtonText from "../../ui/ButtonText";
import Spinner from "../../ui/Spinner";
import Checkbox from "../../ui/Checkbox";

import { useMoveBack } from "../../hooks/useMoveBack";
import { useBooking } from "../bookings/useBooking";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { formatCurrency } from "../../utils/helpers";
import { useCheckin } from "./useCheckin";
import { useSettings } from "../settings/useSettings";

const Box = styled.div`
  /* Box */
  background-color: var(--color-grey-0);
  border: 1px solid var(--color-grey-100);
  border-radius: var(--border-radius-md);
  padding: 2.4rem 4rem;
`;

function CheckinBooking() {
  const [confirmPaid, setConfrimPaid] = useState(false);
  const [addBreakfast, setAddBreakfast] = useState(false);

  const moveBack = useMoveBack();
  const { bookingId: bookingIdParam } = useParams();
  const { booking, isLoading } = useBooking(bookingIdParam);
  const { isCheckingIn, checkin } = useCheckin();
  const navigate = useNavigate();
  const { settings, isLoading: isLoadingSettings } = useSettings();

  useEffect(() => {
    if (addBreakfast) {
      setConfrimPaid(false);
    } else {
      setConfrimPaid(booking?.isPaid || false);
    }
  }, [addBreakfast, booking?.isPaid]);

  if (isLoading || isLoadingSettings) return <Spinner />;

  const {
    id: bookingId,
    guests,
    totalPrice,
    numGuests,
    hasBreakfast,
    numNights,
  } = booking;

  const optionalBreakfastPrice =
    settings.breakfastPrice * numNights * numGuests;

  function handleCheckin() {
    if (!confirmPaid) return;

    const payload = {
      bookingId,
      breakfast: addBreakfast
        ? {
            hasBreakfast: true,
            extrasPrice: optionalBreakfastPrice,
            totalPrice: totalPrice + optionalBreakfastPrice,
          }
        : {},
    };

    checkin(payload, {
      onSuccess: () => navigate(`/bookings/${bookingId}`, { replace: true }),
    });
  }

  return (
    <>
      <Row type="horizontal">
        <Heading as="h1">Check in booking #{bookingId}</Heading>
        <ButtonText onClick={moveBack}>&larr; Back</ButtonText>
      </Row>

      <BookingDataBox booking={booking} />

      {!hasBreakfast && (
        <Box>
          <Checkbox
            checked={addBreakfast}
            onChange={() => setAddBreakfast((add) => !add)}
            id="breakfast"
          >
            Want to add breakfast for {formatCurrency(optionalBreakfastPrice)}?
          </Checkbox>
        </Box>
      )}

      <Box>
        <Checkbox
          checked={confirmPaid}
          onChange={() => setConfrimPaid((c) => !c)}
          id="confirm"
          disabled={addBreakfast ? false : booking.isPaid}
        >
          I confirm that {guests.fullName} has paid the total amount of{" "}
          {!addBreakfast
            ? formatCurrency(totalPrice)
            : `${formatCurrency(
                totalPrice + optionalBreakfastPrice
              )}(${formatCurrency(totalPrice)} +
                  ${formatCurrency(optionalBreakfastPrice)}) `}
        </Checkbox>
      </Box>
      <ButtonGroup>
        <Button disabled={isCheckingIn || !confirmPaid} onClick={handleCheckin}>
          Check in booking #{bookingId}
        </Button>
        <Button disabled={isCheckingIn} variant="secondary" onClick={moveBack}>
          Back
        </Button>
      </ButtonGroup>
    </>
  );
}

export default CheckinBooking;
