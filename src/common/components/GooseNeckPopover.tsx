import { CurvedCornerIcon } from '@/ui/icons/CurvedCornerIcon';
import { Popover as ChakraPopover, Icon, Portal } from '@chakra-ui/react';
import * as React from 'react';

interface PopoverContentProps extends ChakraPopover.ContentProps {
  portalled?: boolean;
  portalRef?: React.RefObject<HTMLElement>;
}

export const GooseNeckPopoverContent = React.forwardRef<HTMLDivElement, PopoverContentProps>(
  function GooseNeckPopoverContent(props, ref) {
    const { portalled = true, portalRef, ...rest } = props;
    return (
      <Portal disabled={!portalled} container={portalRef}>
        <ChakraPopover.Positioner>
          <ChakraPopover.Content ref={ref} {...rest} zIndex="docked" />
        </ChakraPopover.Positioner>
      </Portal>
    );
  }
);

export const GooseNeckPopoverTrigger = React.forwardRef<
  HTMLButtonElement,
  ChakraPopover.TriggerProps & {
    open?: boolean;
    gooseNeckHeight?: number;
    gooseNeckAdjustment?: number;
  }
>(function GooseNeckPopoverTrigger(props, ref) {
  const { open, gooseNeckHeight, gooseNeckAdjustment, ...rest } = props;
  return (
    <ChakraPopover.Trigger
      {...rest}
      ref={ref}
      position="relative"
      height={open ? gooseNeckHeight : 'auto'}
      w="fit-content"
      transform={open ? `translateY(${gooseNeckAdjustment}px)` : 'none'}
      bg="surfacePrimary"
      borderRadius="redesign.lg"
      borderBottomRadius={open ? 'none' : 'redesign.lg'}
      cursor="pointer"
      className="group"
    >
      <>
        {props.children}
        {open && (
          <Icon
            color="var(--stacks-colors-surface-primary)"
            position="absolute"
            bottom={'-1px'}
            right={`${-4 * 4 + 1}px`}
            h={4}
            w={4}
            transform="scaleX(-1)" // Add this line to flip horizontally
          >
            <CurvedCornerIcon />
          </Icon>
        )}
      </>
    </ChakraPopover.Trigger>
  );
});

export const PopoverTitle = ChakraPopover.Title;
export const PopoverDescription = ChakraPopover.Description;
export const PopoverFooter = ChakraPopover.Footer;
export const PopoverHeader = ChakraPopover.Header;
export const PopoverRoot = ChakraPopover.Root;
export const PopoverBody = ChakraPopover.Body;
