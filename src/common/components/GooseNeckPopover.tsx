import { CurvedCornerIcon } from '@/ui/icons/CurvedCornerIcon';
import { Popover as ChakraPopover, Flex, Icon, PopoverRootProps, Portal } from '@chakra-ui/react';
import { CaretDown, CaretUp } from '@phosphor-icons/react';
import * as React from 'react';

interface PopoverContentProps extends ChakraPopover.ContentProps {
  portalled?: boolean;
  portalRef?: React.RefObject<HTMLElement>;
}

export const GooseNeckPopoverRoot = (props: PopoverRootProps) => {
  return (
    <ChakraPopover.Root
      {...props}
      positioning={{
        ...props.positioning,
        placement: props?.positioning?.placement ?? 'bottom-start',
        gutter: props?.positioning?.gutter ?? -1,
      }}
    />
  );
};

export const GooseNeckPopoverContent = React.forwardRef<
  HTMLDivElement,
  PopoverContentProps & { placement?: 'bottom-start' | 'bottom-end' }
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

export const GooseNeckPopoverTrigger = React.forwardRef<
  HTMLButtonElement,
  ChakraPopover.TriggerProps & {
    open?: boolean;
    gooseNeckHeight?: number;
    gooseNeckAdjustment?: number;
    placement?: 'bottom-start' | 'bottom-end'; // Chakra should be exporting these types
    triggerText?: ReactNode;
    triggerIcon?: ReactNode;
    hasIcon?: boolean;
  }
>(function GooseNeckPopoverTrigger(props, ref) {
  const {
    open,
    gooseNeckHeight,
    gooseNeckAdjustment,
    placement = 'bottom-start',
    triggerText,
    triggerIcon,
    hasIcon = true,
    ...buttonProps
  } = props;

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
        h={10}
        alignItems="center"
        justifyContent="center"
        position="relative"
        className="group"
        cursor="pointer"
        w="fit-content"
      >
        {triggerText ? triggerText : props.children}

        {hasIcon ? (
          triggerIcon ? (
            triggerIcon
          ) : (
            <Icon color="iconSecondary" _groupHover={{ color: 'iconPrimary' }} h={3} w={3}>
              {open ? <CaretUp /> : <CaretDown />}
            </Icon>
          )
        ) : null}

        {open && (
          <Icon
            color="var(--stacks-colors-surface-primary)"
            position="absolute"
            bottom={'-1px'}
            left={placement === 'bottom-start' ? undefined : `${-4 * 4 + 1}px`}
            right={placement === 'bottom-end' ? undefined : `${-4 * 4 + 1}px`}
            transform={placement === 'bottom-start' ? 'rotateY(180deg)' : 'none'}
            h={4}
            w={4}
          >
            <CurvedCornerIcon />
          </Icon>
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
