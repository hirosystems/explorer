import React from 'react';
import { Box, BoxProps, Transition, Flex, CloseIcon } from '@blockstack/ui';
import { Card } from '@components/card';
import { Caption } from '@components/typography';
import { PopoverItem } from '@components/popover/default-item';
import { PopoverProps } from '@components/popover/types';
import { usePopover } from '@components/popover/use-popover';
import { CloseButton } from '@components/close-button';

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
  placement,
  showOnClickOrFocus,
  showBackdrop,
  isVisible: _isVisible,
  showClose,
  lockBodyScroll,
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
    wrapper,
    hideImmediately,
  } = usePopover({ length: items?.length ?? 0, triggerRef, showOnClickOrFocus, lockBodyScroll });

  const maxHeight = cardProps?.maxHeight;

  return (
    <Box width="100%" position="relative" zIndex={99} {...rest} {...bindHover}>
      <Box
        style={{
          outline: 'none',
        }}
        {...triggerProps}
      >
        {children}
      </Box>
      {items.length ? (
        <>
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
                  borderRadius: '12px',
                  ...styles,
                }}
                position="absolute"
                zIndex={99999999}
                left={placement === 'left' || placement === undefined ? 0 : 'unset'}
                right={placement === 'right' ? 0 : 'unset'}
                width="100%"
                pt="tight"
                {...wrapperProps}
                {...wrapper}
              >
                <Card
                  role="listbox"
                  boxShadow="high"
                  bg="var(--colors-bg)"
                  overflow="hidden"
                  width="100%"
                  position="relative"
                  zIndex={99}
                  {...cardProps}
                >
                  {label || showClose ? (
                    <Flex
                      borderBottom="1px solid var(--colors-border)"
                      justifyContent="space-between"
                      align="center"
                    >
                      {label ? <PopoverListLabel>{label}</PopoverListLabel> : null}
                      {showClose ? (
                        <CloseButton
                          display={showClose === 'mobile' ? ['block', 'block', 'none'] : 'block'}
                          onClick={hideImmediately}
                          mr="base"
                        />
                      ) : null}
                    </Flex>
                  ) : null}
                  <Box
                    maxHeight={maxHeight}
                    style={{
                      overflowY: 'auto',
                    }}
                  >
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
                        placement={placement}
                      />
                    ))}
                  </Box>
                </Card>
              </Box>
            )}
          </Transition>
          <Transition
            styles={{
              init: {
                opacity: 0,
              },
              entered: {
                opacity: 0.75,
              },
              exiting: {
                opacity: 0,
              },
            }}
            in={showBackdrop && !hideItems && isVisible}
          >
            {styles => (
              <Box
                position="fixed"
                width="100vw"
                height="100vh"
                bg="ink"
                display={['block', 'block', 'none']}
                opacity={0.5}
                zIndex={99999}
                top="64px"
                left={0}
                style={styles}
              />
            )}
          </Transition>
        </>
      ) : null}
    </Box>
  );
};
