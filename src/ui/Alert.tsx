'use client';

import { Alert as CUIAlert, AlertProps as CUIAlertProps, forwardRef } from '@chakra-ui/react';

import { UIComponent } from './types';

export type AlertProps = CUIAlertProps & UIComponent;
export const Alert = forwardRef<AlertProps, 'div'>(({ children, size, ...rest }, ref) => (
  <CUIAlert
    ref={ref}
    width={size || rest.width}
    height={size || rest.height}
    minWidth={size || rest.minWidth}
    minHeight={size || rest.minHeight}
    {...rest}
  >
    {children}
  </CUIAlert>
));
