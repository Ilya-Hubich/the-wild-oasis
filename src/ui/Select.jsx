import { forwardRef } from "react";
import styled from "styled-components";

const StyledSelect = styled.select`
  font-size: 1.4rem;
  padding: 0.8rem 1.2rem;
  border: 1px solid
    ${(props) =>
      props.type === "white"
        ? "var(--color-grey-100)"
        : "var(--color-grey-300)"};
  border-radius: var(--border-radius-sm);
  background-color: var(--color-grey-0);
  font-weight: 500;
  box-shadow: var(--shadow-sm);
`;

const Select = forwardRef(function (
  { id, options, value, onChange, name, onBlur, defaultValue, ...props },
  ref
) {
  return (
    <StyledSelect
      id={id}
      name={name}
      value={value}
      defaultValue={defaultValue}
      {...props}
      onChange={onChange}
      ref={ref}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </StyledSelect>
  );
});

export default Select;
