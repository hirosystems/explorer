import * as React from 'react';
import { BoxProps, Box, transition } from '@stacks/ui';
import { ForwardRefExoticComponentWithAs, forwardRefWithAs } from '@stacks/ui-core';
import { useButton, usePress } from 'react-aria';
import { useFocusableRef } from '@react-spectrum/utils';

const blue = (alpha = 1, darker = false) => `rgba(${darker ? '70,55,255' : '85,70,255'},${alpha})`;

interface ButtonProps extends BoxProps {
  variant?: 'primary' | 'secondary' | 'tertiary';
}

export const Button: ForwardRefExoticComponentWithAs<ButtonProps, 'button'> = forwardRefWithAs<
  ButtonProps,
  'button'
>((props, ref) => {
  const domRef = useFocusableRef(ref);
  const { children, as = 'button', onClick, ...rest } = props;

  const { pressProps, isPressed } = usePress({
    onPress: e => {
      onClick && onClick(e as any);
    },
  });

  return (
    <Box
      as={as}
      bg={blue(1, isPressed)}
      border="1px solid"
      borderColor={blue()}
      outline="none"
      borderRadius="6px"
      px="loose"
      py="base-tight"
      fontSize="14px"
      fontWeight="500"
      color="white"
      transition={transition}
      userSelect="none"
      _hover={{ bg: blue(1, true), cursor: 'pointer' }}
      _focus={{
        boxShadow: '0 0 0 3px rgba(170, 179, 255, 0.75)',
      }}
      ref={domRef as any}
      {...rest}
      {...pressProps}
    >
      {children}
    </Box>
  );
});
