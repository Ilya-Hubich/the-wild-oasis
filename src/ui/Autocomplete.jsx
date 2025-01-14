import styled from "styled-components";
import Input from "./Input";
import { useEffect, useRef, useState } from "react";

const StyledAutocomplete = styled.div`
  display: inline-block;
  position: relative;

  & input {
    width: 100%;
  }
`;

const Results = styled.ul`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  border: 1px solid var(--color-grey-300);
  background-color: var(--color-grey-0);
  border-radius: var(--border-radius-sm);
  padding: 0.8rem 0;
  box-shadow: var(--shadow-sm);
`;

const ResultItem = styled.li`
  cursor: pointer;
  padding: 0.8rem 1.2rem;

  &:hover {
    background-color: var(--color-grey-100);
  }
`;

function Autocomplete({
  id,
  results = [],
  isLoading,
  onChange,
  onBlur,
  onSelect,
  inputRef,
  defaultValue = "",
}) {
  const [query, setQuery] = useState(defaultValue);
  const [showResults, setShowResults] = useState(false);
  const containerRef = useRef();

  function handleInputChange(e) {
    const val = e.target.value;
    setQuery(val);

    if (val.length < 4) {
      setShowResults(false);
      return;
    }

    setShowResults(true);
  }

  useEffect(() => {
    const timerId = setTimeout(() => {
      onChange?.(query);
    }, 500);

    return () => clearTimeout(timerId);
  }, [query, onChange]);

  function handleItemSelection(item) {
    setQuery(item.label);
    setShowResults(false);
    onSelect?.(item);
  }

  useEffect(() => {
    function handleOutsideClick(e) {
      if (containerRef.current && containerRef.current.contains(e.target)) {
        return;
      }

      setShowResults(false);
    }

    document.addEventListener("click", handleOutsideClick);

    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, []);

  return (
    <StyledAutocomplete ref={containerRef}>
      <Input
        id={id}
        value={query}
        onChange={handleInputChange}
        onBlur={onBlur}
        ref={inputRef}
        placeholder="Type to search..."
      />
      {showResults && (
        <Results>
          {results.length > 0 &&
            results.map((item) => (
              <ResultItem
                key={item.value}
                onClick={() => handleItemSelection(item)}
              >
                {item.label}
              </ResultItem>
            ))}

          {!isLoading && results.length === 0 && (
            <ResultItem>No data...</ResultItem>
          )}

          {isLoading && <ResultItem>Loading...</ResultItem>}
        </Results>
      )}
    </StyledAutocomplete>
  );
}

export default Autocomplete;
