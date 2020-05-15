import React from 'react';
import { Box, BoxProps, Transition } from '@blockstack/ui';
import { Card } from '@components/card';
import { Caption } from '@components/typography';
import { PopoverItem } from '@components/popover/default-item';
import { PopoverProps } from '@components/popover/types';
import { usePopover } from '@components/popover/use-popover';

const PopoverListLabel: React.FC<BoxProps> = ({ children, ...rest }) => (
  <Box py="tight" px="base" {...rest}>
    <Caption fontWeight="600" textTransform="uppercase">
      {children}
    </Caption>
  </Box>
);

export const Popover = ({
  dismiss,
  itemComponent: ItemComponent = PopoverItem,
  onItemClick,
  children,
  items,
  cardProps = {},
  wrapperProps = {},
  label,
  triggerRef,
  hideItems,
  activeItem,
  ...rest
}: PopoverProps) => {
  const {
    isVisible,
    bindHover,
    handleChildFocus,
    handleChildBlur,
    currentFocus,
    handleItemClick,
    triggerProps,
  } = usePopover({ length: items?.length ?? 0, triggerRef });

  return (
    <Box width="100%" position="relative" {...bindHover} {...rest}>
      <Box {...triggerProps}>{children}</Box>
      {items.length ? (
        <Transition
          styles={{
            init: {
              opacity: 0,
              transform: 'translateY(5px) scale(1)',
            },
            entered: {
              opacity: 1,
              transform: 'scale(1)',
            },
            exiting: {
              opacity: 0,
              transform: 'translateY(10px) scale(0.99)',
            },
          }}
          in={!hideItems && isVisible}
          onExit={dismiss}
          timeout={200}
        >
          {styles => (
            <Box
              style={{
                willChange: 'transform, opacity',
                ...styles,
              }}
              position="absolute"
              zIndex={999}
              pt="tight"
              {...wrapperProps}
            >
              <Card
                role="listbox"
                boxShadow="high"
                minHeight="100px"
                bg="var(--colors-bg)"
                overflow="hidden"
                {...cardProps}
              >
                {label ? <PopoverListLabel>{label}</PopoverListLabel> : null}
                {items.map((option, key: number) => (
                  <ItemComponent
                    key={key}
                    onFocus={handleChildFocus(key)}
                    onBlur={handleChildBlur(key === items.length - 1, key)}
                    onClick={handleItemClick(() => onItemClick && onItemClick(option))}
                    option={option}
                    focused={currentFocus === key}
                    active={activeItem === key}
                    isLast={key === items.length - 1}
                  />
                ))}
              </Card>
            </Box>
          )}
        </Transition>
      ) : null}
    </Box>
  );
};
