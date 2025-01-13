import { useRef, useEffect } from "react";

export function useClickOutside(onClickOutside, listenCapturing = true) {
  const ref = useRef();

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        onClickOutside();
      }
    }

    document.addEventListener("click", handleClick, listenCapturing);

    return () => {
      document.removeEventListener("click", handleClick, listenCapturing);
    };
  }, [onClickOutside, listenCapturing]);

  return { ref };
}
