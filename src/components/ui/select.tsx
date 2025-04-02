'use client';

import { CurvedCornerIcon } from '@/ui/icons/CurvedCornerIcon';
import { selectSlotRecipe } from '@/ui/theme/recipes/SelectRecipe';
import type { CollectionItem, RecipeVariantProps } from '@chakra-ui/react';
import { Box, Select as ChakraSelect, Flex, Icon, Portal } from '@chakra-ui/react';
import * as React from 'react';

export const CURVED_CORNER_SIZE = 4;
const TAB_HEIGHT_ADJUSTMENT = 8;

interface SelectControlProps extends ChakraSelect.ControlProps {
  open: boolean;
  isContentWiderThanControl?: boolean;
  positioning?: ChakraSelect.RootProps['positioning'];
}
export const SelectControl = React.forwardRef<HTMLDivElement, SelectControlProps>(
  function SelectControl(props, ref) {
    const { open, isContentWiderThanControl, positioning, ...rest } = props;
    const placement = positioning?.placement ?? 'bottom-start';
    const mainAxis = positioning?.offset?.mainAxis ?? TAB_HEIGHT_ADJUSTMENT;

    return (
      <Box position="relative">
        <ChakraSelect.Control
          {...rest}
          ref={ref}
          borderBottomLeftRadius={open ? 'none' : 'redesign.lg'}
          borderBottomRightRadius={open ? 'none' : 'redesign.lg'}
        />
        {open ? (
          isContentWiderThanControl ? (
            <Box
              className="select-tab"
              position="absolute"
              height={mainAxis / 4} // dividing by 4 to account for the fact that the popover root's positioning.offset.mainAxis does not seem to abide my chakra ui's normal scaling of input (*4)
              bottom={-mainAxis / 4}
              left={0}
              w="100%"
              zIndex="docked"
              bg="surfacePrimary"
            >
              <Icon
                color="surfacePrimary"
                position="absolute"
                bottom={'-1px'}
                left={
                  placement === 'bottom-start'
                    ? undefined
                    : `${-1 * (CURVED_CORNER_SIZE * 4) + 1}px`
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
          ) : (
            <Box
              className="select-tab"
              position="absolute"
              height={mainAxis / 4} // dividing by 4 to account for the fact that the popover root's positioning.offset.mainAxis does not seem to abide my chakra ui's normal scaling of input (*4)
              bottom={-mainAxis / 4}
              left={0}
              w="100%"
              zIndex="docked"
              bg="surfacePrimary"
            />
          )
        ) : null}
      </Box>
    );
  }
);
interface SelectTriggerProps extends ChakraSelect.ControlProps {
  clearable?: boolean;
  open: boolean;
  positioning?: ChakraSelect.RootProps['positioning'];
  placeholder?: string;
}

export const SelectTrigger = React.forwardRef<HTMLButtonElement, SelectTriggerProps>(
  function SelectTrigger(props, ref) {
    const { children, clearable, positioning, open, placeholder, ...rest } = props;
    const placement = positioning?.placement ?? 'bottom-start';
    const mainAxis = positioning?.offset?.mainAxis ?? 0;
    return (
      <ChakraSelect.Control {...rest} className="group">
        <ChakraSelect.Trigger ref={ref}>
          <Flex gap={1.5} alignItems="center">
            {children}
            <SelectValueText
              color={open ? 'textPrimary' : 'textSecondary'}
              _groupHover={{
                color: 'textPrimary',
              }}
              placeholder={placeholder}
            />
            <SelectIndicator
              transform={open ? 'rotate(180deg)' : 'none'}
              color={open ? 'iconPrimary' : 'iconSecondary'}
              _groupHover={{
                color: 'iconPrimary',
              }}
            />
          </Flex>
        </ChakraSelect.Trigger>
      </ChakraSelect.Control>
    );
  }
);

interface SelectValueTextProps extends Omit<ChakraSelect.ValueTextProps, 'children'> {
  children?(items: CollectionItem[]): React.ReactNode;
}

export const SelectValueText = React.forwardRef<HTMLSpanElement, SelectValueTextProps>(
  function SelectValueText(props, ref) {
    const { children, ...rest } = props;
    return (
      <ChakraSelect.ValueText {...rest} ref={ref}>
        <ChakraSelect.Context>
          {select => {
            const items = select.selectedItems;
            if (items.length === 0) return props.placeholder;
            if (children) return children(items);
            if (items.length === 1) return select.collection.stringifyItem(items[0]);
            return `${items.length} selected`;
          }}
        </ChakraSelect.Context>
      </ChakraSelect.ValueText>
    );
  }
);

interface SelectContentProps extends ChakraSelect.ContentProps {
  portalled?: boolean;
  portalRef?: React.RefObject<HTMLElement>;
  positioning?: ChakraSelect.RootProps['positioning'];
  open: boolean;
  isContentWiderThanControl?: boolean;
}

export const SelectContent = React.forwardRef<HTMLDivElement, SelectContentProps>(
  function SelectContent(props, ref) {
    const {
      portalled = true,
      portalRef,
      positioning,
      open,
      isContentWiderThanControl,
      ...rest
    } = props;
    const placement = positioning?.placement ?? 'bottom-start';
    const mainAxis = positioning?.offset?.mainAxis ?? TAB_HEIGHT_ADJUSTMENT;
    const borderTopLeftRadius = isContentWiderThanControl
      ? placement === 'bottom-start'
        ? 'none'
        : 'redesign.lg'
      : 'none';
    const borderTopRightRadius = isContentWiderThanControl
      ? placement === 'bottom-start'
        ? 'redesign.lg'
        : 'none'
      : 'none';
    return (
      <Portal disabled={!portalled} container={portalRef}>
        <ChakraSelect.Positioner>
          <ChakraSelect.Content
            {...rest}
            ref={ref}
            position="relative"
            top={mainAxis / 4}
            borderBottomRadius="redesign.lg"
            borderTopRadius="none"
            borderTopLeftRadius={borderTopLeftRadius}
            borderTopRightRadius={borderTopRightRadius}
            boxShadow="elevation2"
          />
        </ChakraSelect.Positioner>
      </Portal>
    );
  }
);

export const SelectItem = React.forwardRef<HTMLDivElement, ChakraSelect.ItemProps>(
  function SelectItem(props, ref) {
    const { item, children, ...rest } = props;
    return (
      <ChakraSelect.Item key={item.value} item={item} {...rest} ref={ref}>
        {children}
      </ChakraSelect.Item>
    );
  }
);

export type SelectVariantProps = RecipeVariantProps<typeof selectSlotRecipe>;

export interface SelectRootProps<V extends string, L extends string>
  extends Omit<ChakraSelect.RootProps, 'size' | 'variant'>,
    SelectVariantProps {
  open: boolean;
  positioning?: ChakraSelect.RootProps['positioning'];
}

export const SelectRoot = React.forwardRef(function SelectRoot<V extends string, L extends string>(
  props: SelectRootProps<V, L>,
  ref: React.Ref<HTMLDivElement>
) {
  const { open, positioning, ...rest } = props;
  const mainAxis = positioning?.offset?.mainAxis ?? 0;
  const crossAxis = positioning?.offset?.crossAxis ?? 0;

  return (
    <ChakraSelect.Root
      ref={ref}
      positioning={{
        sameWidth: true,
        offset: { mainAxis, crossAxis },
        ...props.positioning,
      }}
      borderTopRightRadius="redesign.lg"
      borderTopLeftRadius="redesign.lg"
      borderBottomRightRadius={open ? 'none' : 'redesign.lg'}
      borderBottomLeftRadius={open ? 'none' : 'redesign.lg'}
      onValueChange={(details: ChakraSelect.ValueChangeDetails<{ value: V; label: L }>) => {
        props?.onValueChange?.(details);
      }}
      {...rest}
    >
      {props.asChild ? (
        props.children
      ) : (
        <>
          <ChakraSelect.HiddenSelect />
          {props.children}
        </>
      )}
    </ChakraSelect.Root>
  );
}) as ChakraSelect.RootComponent;

export const SelectLabel = ChakraSelect.Label;
export const SelectItemText = ChakraSelect.ItemText;
export const SelectPositioner = ChakraSelect.Positioner;
export const SelectHiddenSelect = ChakraSelect.HiddenSelect;
export const SelectIndicator = ChakraSelect.Indicator;
