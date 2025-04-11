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

type Placement = 'bottom-start' | 'bottom-end';

export interface PositioningOptions {
  /**
   * The initial placement of the floating element
   */
  placement?: Placement;
  /**
   * The offset of the floating element
   */
  offset?: {
    mainAxis?: number;
    crossAxis?: number;
  };
}

export const TabPopoverRoot = (props: PopoverRootProps) => {
  return (
    <ChakraPopover.Root
      {...props}
      positioning={{
        placement: props?.positioning?.placement ?? undefined,
        offset: props?.positioning?.offset ?? undefined,
      }}
    />
  );
};

const curvedCornerSize = 4;

export const TabPopoverTrigger = React.forwardRef<
  HTMLButtonElement,
  ChakraPopover.TriggerProps & {
    open: boolean;
    positioning?: PositioningOptions;
  }
>(function TabPopoverTrigger(props, ref) {
  const { open, positioning, ...triggerProps } = props;

  const placement = positioning?.placement ?? 'bottom-start';
  const mainAxis = positioning?.offset?.mainAxis ?? 0;

  return (
    <ChakraPopover.Trigger {...triggerProps}>
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
                placement === 'bottom-start' ? undefined : `${-1 * (curvedCornerSize * 4) + 1}px`
              }
              right={
                placement === 'bottom-end' ? undefined : `${-1 * (curvedCornerSize * 4) + 1}px`
              }
              transform={placement === 'bottom-start' ? 'rotateY(180deg)' : 'none'}
              h={curvedCornerSize}
              w={curvedCornerSize}
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
    positioning?: PositioningOptions;
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
