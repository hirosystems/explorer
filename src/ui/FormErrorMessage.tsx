'use client';

import {
  FormErrorMessage as CUIFormErrorMessage,
  FormErrorMessageProps as CUIFormErrorMessageProps,
  forwardRef,
} from '@chakra-ui/react';

import { UIComponent } from './types';

export type FormErrorMessageProps = CUIFormErrorMessageProps & UIComponent;
export const FormErrorMessage = forwardRef<FormErrorMessageProps, 'div'>(
  ({ children, size, ...rest }, ref) => (
    <CUIFormErrorMessage
      ref={ref}
      width={size || rest.width}
      height={size || rest.height}
      minWidth={size || rest.minWidth}
      minHeight={size || rest.minHeight}
      {...rest}
    >
      {children}
    </CUIFormErrorMessage>
  )
);
