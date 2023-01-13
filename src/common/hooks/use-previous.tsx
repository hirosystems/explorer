import React, { useEffect, useRef } from 'react';

function usePrevious<T>(value: T): ReturnType<typeof useRef<T>>['current'] {
  const ref = useRef<T>();
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
}
export default usePrevious;
