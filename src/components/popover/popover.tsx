import React from 'react';
import { Box, BoxProps, Transition, Flex } from '@stacks/ui';
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

/**
 * TODO: clean this up
 */
const PopoverItemList = React.memo(
  ({
    items,
    hideItems,
    dismiss,
    placement,
    wrapperProps,
    cardProps,
    label,
    showClose,
    maxHeight,
    itemComponent: ItemComponent,
    onItemClick,
    activeItem,
    isVisible,
    handleChildFocus,
    handleChildBlur,
    currentFocus,
    handleItemClick,
    wrapper,
    hideImmediately,
  }: any) => {
    return (
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
          in={!!(!hideItems && isVisible)}
          onExit={dismiss}
          timeout={200}
        >
          {styles => (
            <Box
              style={
                {
                  willChange: 'transform, opacity',
                  borderRadius: '12px',
                  ...styles,
                } as any
              }
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
                    alignItems="center"
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
                  {items.map((item: any, key: number) => (
                    <ItemComponent
                      key={key}
                      onFocus={handleChildFocus(key)}
                      onBlur={handleChildBlur(key === items.length - 1, key)}
                      onClick={handleItemClick(() => {
                        onItemClick && onItemClick(item);
                      })}
                      option={item}
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
      </>
    );
  }
);

export const Popover: React.FC<PopoverProps> = React.memo(
  ({
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
  }) => {
    const wrapperRef = React.useRef(null);
    const {
      isVisible,
      bindHover,
      triggerProps,
      handleChildFocus,
      handleChildBlur,
      currentFocus,
      handleItemClick,
      wrapper,
      hideImmediately,
    } = usePopover({
      length: items?.length ?? 0,
      triggerRef,
      wrapperRef,
      showOnClickOrFocus,
      lockBodyScroll,
    });

    const maxHeight = cardProps?.maxHeight;
    const itemListProps = {
      items,
      triggerRef,
      wrapperRef,
      showOnClickOrFocus,
      lockBodyScroll,
      hideItems,
      dismiss,
      placement,
      wrapperProps,
      cardProps,
      label,
      showClose,
      maxHeight,
      itemComponent: ItemComponent,
      onItemClick: (item: any) => {
        onItemClick?.(item);
        hideImmediately();
      },
      activeItem,
      isVisible,
      handleChildFocus,
      handleChildBlur,
      currentFocus,
      handleItemClick,
      wrapper,
      hideImmediately,
    };
    return (
      <>
        <Box
          width="100%"
          position="relative"
          ref={wrapperRef}
          zIndex={999}
          {...rest}
          {...bindHover}
        >
          <Box
            style={{
              outline: 'none',
            }}
            {...triggerProps}
          >
            {children}
          </Box>
          {items.length ? <PopoverItemList {...itemListProps} /> : null}
        </Box>
        {items.length ? (
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
            in={!!(showBackdrop && !hideItems && isVisible)}
          >
            {styles => (
              <Box
                position="fixed"
                width="100vw"
                height="100vh"
                bg="ink"
                opacity={0.4}
                zIndex={99}
                top="64px"
                left={0}
                style={
                  {
                    ...styles,
                  } as any
                }
              />
            )}
          </Transition>
        ) : null}
      </>
    );
  }
);
