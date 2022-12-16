import React from 'react';

import { useMediaQuery, useSafeLayoutEffect } from '@stacks/ui';

export const useLockBodyScroll = (lock: boolean, enableOnDesktop?: boolean) => {
  const [isMobile] = useMediaQuery('(max-width: 760px)');

  useSafeLayoutEffect(() => {
    // Get original body overflow
    const originalStyle = window.getComputedStyle(document.body).overflow;
    if (enableOnDesktop || isMobile) {
      if (lock) {
        if (document.body.style.overflow !== 'hidden') {
          document.body.style.overflow = 'hidden';
        }
      } else {
        if (document.body.style.overflow === originalStyle) {
          document.body.style.overflow = originalStyle;
        }
      }
    } else {
      if (document.body.style.overflow === originalStyle) {
        document.body.style.overflow = originalStyle;
      }
    }

    // Re-enable scrolling when component unmounts
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, [lock, isMobile]); // Empty array ensures effect is only run on mount and unmount
};
