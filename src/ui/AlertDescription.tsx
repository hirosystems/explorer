'use client';

import {
  AlertDescriptionProps as CUAlertDescriptionProps,
  AlertDescription as CUIAlertDescription,
} from '@chakra-ui/react';
import { forwardRef } from 'react';

import { UIComponent } from './types';

export type AlertDescriptionProps = CUAlertDescriptionProps & UIComponent;

export const AlertDescription = forwardRef<HTMLDivElement, AlertDescriptionProps>(
  function AlertDescription({ children, size, ...rest }, ref) {
    return (
      <CUIAlertDescription
        ref={ref}
        width={size || rest.width}
        height={size || rest.height}
        minWidth={size || rest.minWidth}
        minHeight={size || rest.minHeight}
        {...rest}
      >
        {children}
      </CUIAlertDescription>
    );
  }
);
