'use client';

import { CloseButton } from '@/components/ui/close-button';
import type { CollectionItem } from '@chakra-ui/react';
import { Select as ChakraSelect, Portal } from '@chakra-ui/react';
import * as React from 'react';

interface SelectTriggerProps extends ChakraSelect.ControlProps {
  clearable?: boolean;
  open: boolean;
}

export const TabSelectTrigger = React.forwardRef<HTMLButtonElement, SelectTriggerProps>(
  function TabSelectTrigger(props, ref) {
    const { children, clearable, open, ...rest } = props;
    return (
      <ChakraSelect.Control {...rest}>
        <ChakraSelect.Trigger ref={ref}>{children}</ChakraSelect.Trigger>
        <ChakraSelect.IndicatorGroup>
          {clearable && <SelectClearTrigger />}
        </ChakraSelect.IndicatorGroup>
      </ChakraSelect.Control>
    );
  }
);

const SelectClearTrigger = React.forwardRef<HTMLButtonElement, ChakraSelect.ClearTriggerProps>(
  function SelectClearTrigger(props, ref) {
    return (
      <ChakraSelect.ClearTrigger asChild {...props} ref={ref}>
        <CloseButton
          size="xs"
          variant="plain"
          focusVisibleRing="inside"
          focusRingWidth="2px"
          pointerEvents="auto"
        />
      </ChakraSelect.ClearTrigger>
    );
  }
);

interface SelectContentProps extends ChakraSelect.ContentProps {
  portalled?: boolean;
  portalRef?: React.RefObject<HTMLElement>;
}

export const SelectContent = React.forwardRef<HTMLDivElement, SelectContentProps>(
  function SelectContent(props, ref) {
    const { portalled = true, portalRef, ...rest } = props;
    return (
      <Portal disabled={!portalled} container={portalRef}>
        <ChakraSelect.Positioner>
          <ChakraSelect.Content {...rest} ref={ref} />
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

export const SelectRoot = React.forwardRef<HTMLDivElement, ChakraSelect.RootProps>(
  function SelectRoot(props, ref) {
    return (
      <ChakraSelect.Root
        {...props}
        ref={ref}
        positioning={{
          sameWidth: true,
          offset: { mainAxis: 1, crossAxis: 0 },
          ...props.positioning,
        }}
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
  }
) as ChakraSelect.RootComponent;

interface SelectItemGroupProps extends ChakraSelect.ItemGroupProps {
  label: React.ReactNode;
}

export const SelectItemGroup = React.forwardRef<HTMLDivElement, SelectItemGroupProps>(
  function SelectItemGroup(props, ref) {
    const { children, label, ...rest } = props;
    return (
      <ChakraSelect.ItemGroup {...rest} ref={ref}>
        <ChakraSelect.ItemGroupLabel>{label}</ChakraSelect.ItemGroupLabel>
        {children}
      </ChakraSelect.ItemGroup>
    );
  }
);

export const SelectLabel = ChakraSelect.Label;
export const SelectItemText = ChakraSelect.ItemText;
export const SelectPositioner = ChakraSelect.Positioner;
export const SelectControl = ChakraSelect.Control;
export const SelectHiddenSelect = ChakraSelect.HiddenSelect;
export const SelectIndicator = ChakraSelect.Indicator;
