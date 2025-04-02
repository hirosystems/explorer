import { useEffect, useRef, useState } from 'react';

export function useIsInViewport(ref: React.RefObject<HTMLElement | null>) {
  const [isInView, setIsInView] = useState(true);

  useEffect(() => {
    if (!ref.current) return;
    const observer = new window.IntersectionObserver(
      ([entry]) => setIsInView(entry.isIntersecting),
      { threshold: 0 }
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [ref]);

  return isInView;
}
