import { Box, BoxProps } from '@chakra-ui/react';
import { useCallback, useEffect, useRef, useState } from 'react';

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
} & BoxProps) => {
  const triggerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [menuTriggerHeight, setMenuTriggerHeight] = useState(0);
  const [uncontrolledIsOpen, setUncontrolledIsOpen] = useState(false);
  const isControlled = controlledIsOpen !== undefined;
  const isOpen = isControlled ? controlledIsOpen : uncontrolledIsOpen;

  useEffect(() => {
    if (triggerRef.current) {
      setMenuTriggerHeight(triggerRef.current.offsetHeight);
    }
  }, []);

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
    <Box position="relative" h={height ?? 'full'} minWidth={width} ref={triggerRef}>
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
          isOpen && contentRef?.current?.scrollHeight
            ? `${contentRef?.current?.scrollHeight + menuTriggerHeight}px`
            : `${menuTriggerHeight}px`
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
          h={`${menuTriggerHeight}px`}
          minWidth={width}
          boxSizing="border-box"
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
