import styled from "styled-components";
import Input from "./Input";
import { useEffect, useState } from "react";
import { useDebouncedValue } from "../hooks/useDebouncedValue";
import { useClickOutside } from "../hooks/useClickOutside";

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
  defaultValue,
  debounce = 500,
  minQueryLength = 3,
  disabled,
  renderResults,
  getLabel = (item) => item,
}) {
  const [query, setQuery] = useState(
    defaultValue ? getLabel(defaultValue) : ""
  );
  const debouncedQuery = useDebouncedValue(query, debounce);
  const [selectedOption, setSelectedOption] = useState(defaultValue || null);
  const [isSelected, setIsSelected] = useState(!!defaultValue);
  const [showResults, setShowResults] = useState(false);
  const { ref: containerRef } = useClickOutside(() => {
    setShowResults(false);

    if (selectedOption) {
      setQuery(getLabel(selectedOption));
    }
  });

  function handleInputChange(e) {
    const val = e.target.value;
    setQuery(val);
    setIsSelected(false);
  }

  function handleOptionSelection(option) {
    setIsSelected(true);
    setQuery(getLabel(option));
    setSelectedOption(option);
    setShowResults(false);
    onSelect?.(option);
  }

  useEffect(() => {
    if (isSelected) {
      return;
    }

    if (selectedOption && debouncedQuery === getLabel(selectedOption)) {
      return;
    }

    if (debouncedQuery.length === 0) {
      setSelectedOption(null);
      onSelect?.();
    }

    if (debouncedQuery.length < minQueryLength) {
      setShowResults(false);
      return;
    }

    setShowResults(true);
    onChange?.(debouncedQuery);
  }, [
    debouncedQuery,
    onChange,
    selectedOption,
    minQueryLength,
    isSelected,
    onSelect,
    getLabel,
  ]);

  return (
    <StyledAutocomplete ref={containerRef}>
      <Input
        id={id}
        value={query}
        onChange={handleInputChange}
        onBlur={onBlur}
        ref={inputRef}
        placeholder="Type to search..."
        disabled={disabled}
      />
      {showResults && (
        <Results>
          {!isLoading &&
            results.length > 0 &&
            results.map((item) => (
              <ResultItem
                key={getLabel(item)}
                onClick={() => handleOptionSelection(item)}
              >
                {renderResults ? renderResults(item) : getLabel(item)}
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
