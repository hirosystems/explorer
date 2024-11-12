'use client';

import {
  AlertTitleProps as CUAlertTitleProps,
  AlertTitle as CUIAlertTitle,
} from '@chakra-ui/react';
import { forwardRef } from 'react';

import { UIComponent } from './types';

export type AlertTitleProps = CUAlertTitleProps & UIComponent;
export const AlertTitle = forwardRef<HTMLDivElement, AlertTitleProps>(
  ({ children, size, ...rest }, ref) => (
    <CUIAlertTitle
      ref={ref}
      width={size || rest.width}
      height={size || rest.height}
      minWidth={size || rest.minWidth}
      minHeight={size || rest.minHeight}
      {...rest}
    >
      {children}
    </CUIAlertTitle>
  )
);
