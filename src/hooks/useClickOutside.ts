import { RefObject, useEffect, useRef } from 'react';

export const useClickOutside = (
  ref: RefObject<HTMLElement | undefined>,
  callback: () => void
) => {
  const callbackRef = useRef(callback);
  const isClickInsideRef = useRef(false);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    const handleMouseDown = (event: MouseEvent) => {
      if (ref.current && ref.current.contains(event.target as Node)) {
        isClickInsideRef.current = true;
      } else {
        isClickInsideRef.current = false;
      }
    };

    const handleMouseUp = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node) && !isClickInsideRef.current) {
        callbackRef.current();
      }
      isClickInsideRef.current = false;
    };

    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [ref]);
};