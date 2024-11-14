'use client';

import { FormLabel as CUIFormLabel, FormLabelProps as CUIFormLabelProps } from '@chakra-ui/react';
import { forwardRef } from 'react';

import { UIComponent } from './types';

export type FormLabelProps = CUIFormLabelProps & UIComponent;
export const FormLabel = forwardRef<HTMLDivElement, FormLabelProps>(
  ({ children, size, ...rest }, ref) => (
    <CUIFormLabel
      ref={ref}
      width={size || rest.width}
      height={size || rest.height}
      minWidth={size || rest.minWidth}
      minHeight={size || rest.minHeight}
      fontSize={'12px'}
      colo={'textCaption'}
      {...rest}
    >
      {children}
    </CUIFormLabel>
  )
);
