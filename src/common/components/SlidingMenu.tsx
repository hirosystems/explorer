import { Box, BoxProps } from '@chakra-ui/react';
import { useCallback, useRef, useState } from 'react';

export const SlidingMenu = ({
  menuTrigger,
  menuTriggerProps,
  menuContent,
  menuContentProps,
  menuSlidingMenuProps,
  isOpen: controlledIsOpen,
  onOpenChange,
  triggerWidth,
  triggerHeight,
}: {
  triggerWidth: number;
  triggerHeight: number;
  menuTrigger: React.ReactNode;
  menuTriggerProps?: BoxProps;
  menuContent: React.ReactNode;
  menuContentProps?: BoxProps;
  menuSlidingMenuProps?: BoxProps;
  isOpen?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
} & BoxProps) => {
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
    <Box position="relative" h={triggerHeight} minWidth={triggerWidth}>
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
        <Box
          className="menu-trigger"
          display="flex" // menuTriggerProps doesn't match FlexProps so this has to be a Box
          alignItems="center"
          {...menuTriggerProps}
        >
          {menuTrigger}
        </Box>
        <Box className="menu-content" ref={contentRef} {...menuContentProps}>
          {menuContent}
        </Box>
      </Box>
    </Box>
  );
};
