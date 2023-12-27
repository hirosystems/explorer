'use client';

import {
  InputRightElement as CUIInputRightElement,
  InputElementProps as CUIInputRightElementProps,
  forwardRef,
  useColorMode,
} from '@chakra-ui/react';

import { UIComponent } from './types';

export type InputRightElementProps = CUIInputRightElementProps & UIComponent;
export const InputRightElement = forwardRef<InputRightElementProps, 'div'>(
  ({ children, size, ...rest }, ref) => (
    <CUIInputRightElement
      ref={ref}
      width={size || rest.width}
      height={size || rest.height}
      minWidth={size || rest.minWidth}
      minHeight={size || rest.minHeight}
      {...rest}
    >
      {children}
    </CUIInputRightElement>
  )
);
