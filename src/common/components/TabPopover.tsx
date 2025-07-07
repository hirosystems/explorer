import { CurvedCornerIcon } from '@/ui/icons/CurvedCornerIcon';
import {
  Box,
  Popover as ChakraPopover,
  Flex,
  Icon,
  PopoverRootProps,
  Portal,
} from '@chakra-ui/react';
import * as React from 'react';

interface PopoverContentProps extends ChakraPopover.ContentProps {
  portalled?: boolean;
  portalRef?: React.RefObject<HTMLElement>;
}

export const TabPopoverRoot = (props: PopoverRootProps) => {
  return <ChakraPopover.Root {...props} positioning={props?.positioning} />;
};

export const CURVED_CORNER_SIZE = 4;

export const TabPopoverTrigger = React.forwardRef<
  HTMLButtonElement,
  ChakraPopover.TriggerProps & {
    open: boolean;
    positioning?: PopoverRootProps['positioning'];
  }
>(function TabPopoverTrigger(props, ref) {
  const { open, positioning, ...triggerProps } = props;

  const placement = positioning?.placement ?? 'bottom-start';
  const mainAxis = positioning?.offset?.mainAxis ?? 0;

  return (
    <ChakraPopover.Trigger {...triggerProps} ref={ref}>
      <Flex position="relative">
        {props.children}

        {open && (
          <Box
            className="tab"
            position="absolute"
            height={mainAxis / 4} // dividing by 4 to account for the fact that the popover root's positioning.offset.mainAxis does not seem to abide my chakra ui's normal scaling of input (*4)
            bottom={-mainAxis / 4}
            left={0}
            bg="surfacePrimary"
            w="100%"
          >
            <Icon
              color="surfacePrimary"
              position="absolute"
              bottom={'-1px'}
              left={
                placement === 'bottom-start' ? undefined : `${-1 * (CURVED_CORNER_SIZE * 4) + 1}px`
              }
              right={
                placement === 'bottom-end' ? undefined : `${-1 * (CURVED_CORNER_SIZE * 4) + 1}px`
              }
              transform={placement === 'bottom-start' ? 'rotateY(180deg)' : 'none'}
              h={CURVED_CORNER_SIZE}
              w={CURVED_CORNER_SIZE}
            >
              <CurvedCornerIcon />
            </Icon>
          </Box>
        )}
      </Flex>
    </ChakraPopover.Trigger>
  );
});

export const TabPopoverContent = React.forwardRef<
  HTMLDivElement,
  PopoverContentProps & {
    positioning?: PopoverRootProps['positioning'];
  }
>(function TabPopoverContent(props, ref) {
  const { portalled = true, portalRef, ...rest } = props;
  return (
    <Portal disabled={!portalled} container={portalRef}>
      <ChakraPopover.Positioner>
        <ChakraPopover.Content
          {...rest}
          ref={ref}
          zIndex="docked"
          borderRadius="redesign.lg"
          borderTopLeftRadius={
            props.positioning?.placement === 'bottom-start' ? 'none' : 'redesign.lg'
          }
          borderTopRightRadius={
            props.positioning?.placement === 'bottom-end' ? 'none' : 'redesign.lg'
          }
          boxShadow="none"
          bg="surfacePrimary"
          width="auto"
          minWidth={'fit-content'}
          marginRight={
            props.positioning?.placement === 'bottom-start' ? -(CURVED_CORNER_SIZE + 1) : 0
          }
          marginLeft={props.positioning?.placement === 'bottom-end' ? -(CURVED_CORNER_SIZE + 1) : 0}
          bgColor={'surfacePrimary'}
        >
          {props.children}
        </ChakraPopover.Content>
      </ChakraPopover.Positioner>
    </Portal>
  );
});

export const TabPopoverTitle = ChakraPopover.Title;
export const TabPopoverDescription = ChakraPopover.Description;
export const TabPopoverFooter = ChakraPopover.Footer;
export const TabPopoverHeader = ChakraPopover.Header;
export const TabPopoverBody = ChakraPopover.Body;
