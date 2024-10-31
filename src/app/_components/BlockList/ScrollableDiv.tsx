import { ReactNode, useEffect, useRef, useState } from 'react';

import { Box, BoxProps } from '../../../ui/Box';

// adds horizontal scrolling to its children if they overflow the container's width, and adds a class to the container when it has a horizontal scrollbar
export function ScrollableBox({ children, ...rest }: BoxProps & { children: ReactNode }) {
  const [hasHorizontalScroll, setHasHorizontalScroll] = useState(false);
  const divRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const checkForScroll = () => {
      if (divRef.current) {
        const { scrollWidth, clientWidth } = divRef.current;
        if (scrollWidth > clientWidth) {
          setHasHorizontalScroll(true);
        } else {
          setHasHorizontalScroll(false);
        }
      }
    };
    checkForScroll();
    window.addEventListener('resize', checkForScroll);
    return () => window.removeEventListener('resize', checkForScroll);
  }, []);

  return (
    <Box
      ref={divRef}
      overflowX="auto"
      overflowY="hidden"
      className={hasHorizontalScroll ? 'scrollableBox has-horizontal-scroll' : 'scrollableBox'}
    >
      {children}
    </Box>
  );
}
