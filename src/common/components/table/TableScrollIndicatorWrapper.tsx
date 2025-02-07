import { Box, BoxProps, Flex, Icon } from '@chakra-ui/react';
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
        setHasHorizontalScroll(scrollWidth > clientWidth);
      }
    };

    const checkScrollPosition = () => {
      if (divRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = divRef.current;
        // Add small buffer (1px) for floating point precision
        setIsScrolledToEnd(Math.abs(scrollWidth - clientWidth - scrollLeft) <= 1);
      }
    };

    checkForScroll();
    checkScrollPosition();

    const element = divRef.current;
    element?.addEventListener('scroll', checkScrollPosition);
    window.addEventListener('resize', checkForScroll);

    return () => {
      element?.removeEventListener('scroll', checkScrollPosition);
      window.removeEventListener('resize', checkForScroll);
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
        {...rest}
      >
        {children}
      </Box>
      {hasHorizontalScroll && !isScrolledToEnd && (
        <Flex position="absolute" right={0} top={0} h="full" className="scroll-indicator">
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
    </Box>
  );
}
