'use client';

import {
  FormErrorMessage as CUIFormErrorMessage,
  FormErrorMessageProps as CUIFormErrorMessageProps,
} from '@chakra-ui/react';
import { forwardRef } from 'react';

import { UIComponent } from './types';

export type FormErrorMessageProps = CUIFormErrorMessageProps & UIComponent;
export const FormErrorMessage = forwardRef<HTMLDivElement, FormErrorMessageProps>(
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
