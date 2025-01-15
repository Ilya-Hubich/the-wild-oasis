import { useEffect, useState } from "react";

export function useDebouncedValue(value, debounce) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timerId = setTimeout(() => setDebouncedValue(value), debounce);

    return () => clearTimeout(timerId);
  }, [value, debounce]);

  return debouncedValue;
}
