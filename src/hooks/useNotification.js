import { useState, useCallback, useRef } from "react";

export function useNotification() {
  const [notification, setNotification] = useState({
    message: null,
    type: "success",
  });
  const timerRef = useRef(null);

  const showNotification = useCallback(({ message, type }) => {
    if (timerRef.current) clearTimeout(timerRef.current);

    setNotification({ message, type });
    timerRef.current = setTimeout(() => {
      setNotification({ message: null, type });
    }, 3000);
  }, []);

  const clearNotification = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setNotification({ message: null, type: "success" });
  }, []);

  return { notification, showNotification, clearNotification };
}
