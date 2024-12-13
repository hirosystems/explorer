'use client';

import {
  IconButton as CUIIconButton,
  IconButtonProps as CUIIconButtonProps,
} from '@chakra-ui/react';
import { forwardRef } from 'react';

import { UIComponent } from './types';

export type IconButtonProps = Omit<CUIIconButtonProps, 'size'> & UIComponent;
export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ children, size, ...rest }, ref) => (
    <CUIIconButton
      ref={ref}
      width={size || rest.width}
      height={size || rest.height}
      minWidth={size || rest.minWidth}
      minHeight={size || rest.minHeight}
      bg={'transparent'} // TODO: put these in the theme
      _hover={{ bg: 'rgba(255, 255, 255, 0.15)' }}
      borderRadius={'full'}
      {...rest}
    >
      {children}
    </CUIIconButton>
  )
);
