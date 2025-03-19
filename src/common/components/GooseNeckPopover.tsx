import { CurvedCornerIcon } from '@/ui/icons/CurvedCornerIcon';
import {
  Box,
  Popover as ChakraPopover,
  Flex,
  Icon,
  PopoverRootProps,
  Portal,
} from '@chakra-ui/react';
import { CaretDown, CaretUp } from '@phosphor-icons/react';
import * as React from 'react';
import { ReactNode } from 'react';

interface PopoverContentProps extends ChakraPopover.ContentProps {
  portalled?: boolean;
  portalRef?: React.RefObject<HTMLElement>;
}

type Placement = 'bottom-start' | 'bottom-end';

interface PositioningOptions {
  /**
   * The initial placement of the floating element
   */
  placement?: Placement;
  /**
   * The offset of the floating element
   */
  offset?: {
    mainAxis?: number;
  };
}

export const GooseNeckPopoverRoot = (props: PopoverRootProps) => {
  return (
    <ChakraPopover.Root
      {...props}
      positioning={{
        ...props.positioning,
        placement: props?.positioning?.placement ?? 'bottom-start',
        offset: props?.positioning?.offset ?? {
          mainAxis: 0,
        },
      }}
    />
  );
};

export const GooseNeckPopoverContent = React.forwardRef<
  HTMLDivElement,
  PopoverContentProps & PositioningOptions
>(function GooseNeckPopoverContent(props, ref) {
  const { portalled = true, portalRef, placement = 'bottom-start', ...rest } = props;
  return (
    <Portal disabled={!portalled} container={portalRef}>
      <ChakraPopover.Positioner>
        <ChakraPopover.Content
          ref={ref}
          {...rest}
          zIndex="docked"
          borderRadius="redesign.lg"
          borderTopLeftRadius={placement === 'bottom-start' ? 'none' : 'redesign.lg'}
          borderTopRightRadius={placement === 'bottom-end' ? 'none' : 'redesign.lg'}
          boxShadow="none"
          bg="surfacePrimary"
        >
          {props.children}
        </ChakraPopover.Content>
      </ChakraPopover.Positioner>
    </Portal>
  );
});

const curvedCornerSize = 4;

export const GooseNeckPopoverTrigger = React.forwardRef<
  HTMLButtonElement,
  ChakraPopover.TriggerProps & {
    open: boolean;
    triggerText?: (open: boolean) => ReactNode;
    triggerIcon?: ReactNode;
    hasIcon?: boolean;
    positioning?: PositioningOptions;
  }
>(function GooseNeckPopoverTrigger(props, ref) {
  const { open, positioning, triggerText, triggerIcon, hasIcon = true } = props;

  const placement = positioning?.placement ?? 'bottom-start';
  const mainAxis = positioning?.offset?.mainAxis ?? 0;

  return (
    <ChakraPopover.Trigger>
      <Flex
        bg="surfacePrimary"
        borderRadius="redesign.lg"
        borderTopRadius="redesign.lg"
        borderBottomRadius={open ? 'none' : 'redesign.lg'}
        py={1.5}
        px={4}
        gap={1.5}
        alignItems="center"
        justifyContent="center"
        position="relative"
        className="group"
        cursor="pointer"
        w="fit-content"
      >
        {triggerText ? triggerText(open) : props.children}

        {hasIcon ? (
          triggerIcon ? (
            triggerIcon
          ) : (
            <Icon
              color={open ? 'iconPrimary' : 'iconSecondary'}
              _groupHover={{ color: 'iconPrimary' }}
              h={3}
              w={3}
            >
              {open ? <CaretUp /> : <CaretDown />}
            </Icon>
          )
        ) : null}

        {open && (
          <Box
            className="gooseneck"
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

export const PopoverTitle = ChakraPopover.Title;
export const PopoverDescription = ChakraPopover.Description;
export const PopoverFooter = ChakraPopover.Footer;
export const PopoverHeader = ChakraPopover.Header;
export const PopoverRoot = ChakraPopover.Root;
export const PopoverBody = ChakraPopover.Body;
