import * as React from 'react';
import { BoxProps, Box, transition, color } from '@stacks/ui';
import { ForwardRefExoticComponentWithAs, forwardRefWithAs } from '@stacks/ui-core';
import { usePress } from 'react-aria';
import { useFocusableRef } from '@react-spectrum/utils';

export const blue = '#9146FF';
export const focusBlue = `#9146FF`;

interface ButtonProps extends BoxProps {
  variant?: 'primary' | 'secondary' | 'tertiary';
}

const variantStyles = (variant: ButtonProps['variant']) => {
  switch (variant) {
    case 'secondary':
      return (isPressed: boolean) => ({
        bg: '#9146FF',
        color: color('invert'),
        borderColor: blue(0),
        _hover: { bg: '#9146FF', cursor: 'pointer' },
        _focus: {
          boxShadow: `0 0 0 3px ${focusBlue(0.5)}`,
        },
      });
    default:
      return (isPressed: boolean) => ({
        bg: '#9146FF',
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
      background="#9146FF"
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
