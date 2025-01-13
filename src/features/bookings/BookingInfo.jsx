import styled from "styled-components";
import { formatCurrency } from "../../utils/helpers";

const Box = styled.div`
  /* Box */
  background-color: var(--color-grey-0);
  border: 1px solid var(--color-grey-100);
  border-radius: var(--border-radius-md);
  padding: 2.4rem 4rem;
  margin-top: 2.4rem;
`;

function BookingInfo({ booking }) {
  const { hasBreakfast, cabinPrice, breakfastPrice } = booking;

  return (
    <Box>
      <p>
        {!hasBreakfast
          ? formatCurrency(cabinPrice)
          : `${formatCurrency(cabinPrice + breakfastPrice)}(${formatCurrency(
              cabinPrice
            )} + ${formatCurrency(breakfastPrice)}) `}
      </p>
    </Box>
  );
}

export default BookingInfo;
