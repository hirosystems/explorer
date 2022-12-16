import { useFocusableRef } from '@react-spectrum/utils';
import * as React from 'react';
import { usePress } from 'react-aria';

import { Box, BoxProps, color, transition } from '@stacks/ui';
import { ForwardRefExoticComponentWithAs, forwardRefWithAs } from '@stacks/ui-core';

export const blue = (alpha = 1, darker = false) =>
  `rgba(${darker ? '70,55,255' : '85,70,255'},${alpha})`;
export const focusBlue = (alpha = 1) => `rgba(170, 179, 255,${alpha})`;

interface ButtonProps extends BoxProps {
  variant?: 'primary' | 'secondary' | 'tertiary';
}

const variantStyles = (variant: ButtonProps['variant']) => {
  switch (variant) {
    case 'secondary':
      return (isPressed: boolean) => ({
        bg: blue(0.2, isPressed),
        color: color('invert'),
        borderColor: blue(0),
        _hover: { bg: blue(0.25, true), cursor: 'pointer' },
        _focus: {
          boxShadow: `0 0 0 3px ${focusBlue(0.5)}`,
        },
      });
    default:
      return (isPressed: boolean) => ({
        bg: blue(1, isPressed),
        borderColor: blue(0),
        _hover: { bg: blue(1, true), cursor: 'pointer' },
        _focus: {
          boxShadow: `0 0 0 3px ${focusBlue(0.75)}`,
        },
      });
  }
};

export const Button: ForwardRefExoticComponentWithAs<ButtonProps, 'button'> = forwardRefWithAs<
  ButtonProps,
  'button'
>(({ variant = 'primary', ...props }, ref) => {
  const { children, as = 'button', onClick, ...rest } = props;
  const variantStyle = variantStyles(variant);
  const { pressProps, isPressed } = usePress({
    ref,
    onPress: e => {
      onClick?.(e as any);
    },
  });
  const { onKeyUp, onKeyDown } = pressProps;
  return (
    <Box
      as={as}
      border="1px solid"
      outline="none"
      borderRadius="6px"
      px="loose"
      py="base-tight"
      fontSize="14px"
      fontWeight="500"
      color="white"
      transition={transition}
      userSelect="none"
      ref={ref}
      onKeyUp={onKeyUp}
      onKeyDown={onKeyDown}
      onClick={e => {
        onClick?.(e);
      }}
      {...rest}
      {...variantStyle(isPressed)}
    >
      {children}
    </Box>
  );
});
