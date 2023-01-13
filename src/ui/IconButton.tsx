'use client';

import {
  IconButton as CUIIconButton,
  IconButtonProps as CUIIconButtonProps,
  forwardRef,
} from '@chakra-ui/react';

import { UIComponent } from './types';

export type IconButtonProps = CUIIconButtonProps & UIComponent;
export const IconButton = forwardRef<IconButtonProps, 'button'>(
  ({ children, size, ...rest }, ref) => (
    <CUIIconButton
      ref={ref}
      width={size || rest.width}
      height={size || rest.height}
      minWidth={size || rest.minWidth}
      minHeight={size || rest.minHeight}
      bg={'transparent'}
      _hover={{ bg: 'rgba(255, 255, 255, 0.15)' }}
      isRound
      {...rest}
    >
      {children}
    </CUIIconButton>
  )
);
