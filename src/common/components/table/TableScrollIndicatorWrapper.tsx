import { Box, BoxProps, Flex, Icon, VisuallyHidden } from '@chakra-ui/react';
import { CaretRight } from '@phosphor-icons/react';
import { ReactNode, useEffect, useRef, useState } from 'react';

export function ScrollIndicatorWrapper({ children, ...rest }: BoxProps & { children: ReactNode }) {
  const [hasHorizontalScroll, setHasHorizontalScroll] = useState(false);
  const [isScrolledToEnd, setIsScrolledToEnd] = useState(false);
  const divRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const checkForScroll = () => {
      if (divRef.current) {
        const { scrollWidth, clientWidth } = divRef.current;
        console.log('checking for scroll');
        setHasHorizontalScroll(scrollWidth > clientWidth);
      }
    };

    const checkScrollPosition = () => {
      if (divRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = divRef.current;
        // Add small buffer (1px) for floating point precision
        console.log('checking scroll position');
        setIsScrolledToEnd(Math.abs(scrollWidth - clientWidth - scrollLeft) <= 1);
      }
    };

    // Debounce the handlers with a 150ms delay
    const debouncedCheckForScroll = debounce(checkForScroll, 150);
    const debouncedCheckScrollPosition = debounce(checkScrollPosition, 150);

    // Initial checks without debouncing
    checkForScroll();
    checkScrollPosition();

    const element = divRef.current;
    element?.addEventListener('scroll', debouncedCheckScrollPosition);
    window.addEventListener('resize', debouncedCheckForScroll);

    return () => {
      element?.removeEventListener('scroll', debouncedCheckScrollPosition);
      window.removeEventListener('resize', debouncedCheckForScroll);
      // Clean up any pending timeouts
      debouncedCheckForScroll.cancel?.();
      debouncedCheckScrollPosition.cancel?.();
    };
  }, []);

  return (
    <Box position="relative" className="scroll-indicator-positioner">
      <Box
        ref={divRef}
        overflowX={'auto'}
        overflowY={'hidden'}
        className={
          hasHorizontalScroll
            ? 'scroll-indicator-wrapper has-horizontal-scroll'
            : 'scroll-indicator-wrapper'
        }
        aria-label={hasHorizontalScroll ? 'Content with horizontal scroll' : 'Content'}
        role="region"
        {...rest}
      >
        {children}
      </Box>
      {hasHorizontalScroll && !isScrolledToEnd && (
        <Flex
          position="absolute"
          right={0}
          top={0}
          h="full"
          className="scroll-indicator"
          aria-hidden="true"
        >
          <Box w={2} h="full" bg="surface"></Box>
          <Flex
            position="relative"
            top="50%"
            transform="translateY(-50%)"
            bg="surfacePrimary"
            borderRadius="redesign.xs"
            zIndex="overlay"
            h="full"
            alignItems="center"
            justifyContent="center"
            w={4}
          >
            <Icon h={4} w={4} color="iconSecondary">
              <CaretRight weight="fill" />
            </Icon>
          </Flex>
        </Flex>
      )}
      {hasHorizontalScroll && (
        <VisuallyHidden id="scroll-indicator-description">
          This content can be scrolled horizontally.{' '}
          {isScrolledToEnd
            ? "You've reached the end of the content."
            : 'Scroll right to see more content.'}
        </VisuallyHidden>
      )}
    </Box>
  );
}

// Add TypeScript type for the debounced function
type DebouncedFunction<T extends (...args: any[]) => void> = {
  (...args: Parameters<T>): void;
  cancel?: () => void;
};

// Update the debounce function to include cancel method
function debounce<T extends (...args: any[]) => void>(fn: T, delay: number): DebouncedFunction<T> {
  let timeoutId: NodeJS.Timeout;

  const debouncedFn: DebouncedFunction<T> = (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };

  debouncedFn.cancel = () => {
    clearTimeout(timeoutId);
  };

  return debouncedFn;
}
