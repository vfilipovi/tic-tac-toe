import { useEffect, useRef } from "react";

type CallbackFunction = () => void;

// Clear interval by setting delay as null
export function useInterval(callback: CallbackFunction, delay: number | null) {
  const savedCallback = useRef<CallbackFunction | null>(null);

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    function tick() {
      if (savedCallback?.current) {
        savedCallback.current();
      }
    }
    if (delay !== null) {
      const id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}
