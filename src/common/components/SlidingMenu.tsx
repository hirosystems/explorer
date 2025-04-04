import { Box, BoxProps, Flex } from '@chakra-ui/react';
import { useCallback, useRef, useState } from 'react';

export const SlidingMenu = ({
  menuTrigger,
  menuTriggerProps,
  menuContent,
  menuContentProps,
  menuSlidingMenuProps,
  isOpen: controlledIsOpen,
  onOpenChange,
  height,
  width,
  triggerHeight,
}: {
  height?: number;
  width: number;
  menuTrigger: React.ReactNode;
  menuTriggerProps?: BoxProps;
  menuContent: React.ReactNode;
  menuContentProps?: BoxProps;
  menuSlidingMenuProps?: BoxProps;
  isOpen?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
  triggerHeight: number;
} & BoxProps) => {
  const triggerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [uncontrolledIsOpen, setUncontrolledIsOpen] = useState(false);
  const isControlled = controlledIsOpen !== undefined;
  const isOpen = isControlled ? controlledIsOpen : uncontrolledIsOpen;

  const setIsOpen = useCallback(
    (value: boolean) => {
      if (!isControlled) {
        setUncontrolledIsOpen(value);
      }
      onOpenChange?.(value);
    },
    [isControlled, onOpenChange]
  );

  return (
    <Box position="relative" h={triggerHeight} minWidth={width} ref={triggerRef}>
      <Box
        className="sliding-menu"
        onMouseEnter={() => {
          setIsOpen(true);
          onOpenChange?.(true);
        }}
        onMouseLeave={() => {
          setIsOpen(false);
          onOpenChange?.(false);
        }}
        overflow="hidden"
        transition="height 0.5s ease"
        height={
          !isOpen
            ? `${triggerHeight * 4}px`
            : `${contentRef?.current?.scrollHeight ?? 0 + triggerHeight * 4}px`
        }
        position="absolute"
        zIndex="dropdown"
        bg="surfacePrimary"
        borderRadius="redesign.lg"
        boxShadow={isOpen ? 'var(--stacks-shadows-elevation2)' : 'none'}
        {...menuSlidingMenuProps}
      >
        <Flex
          className="menu-trigger"
          alignItems='center'
          // h={`${triggerHeight}px`}
          // minWidth={width}
          // boxSizing="border-box"
          {...menuTriggerProps}
        >
          {menuTrigger}
        </Flex>
        <Box className="menu-content" ref={contentRef} {...menuContentProps}>
          {menuContent}
        </Box>
      </Box>
    </Box>
  );
};
