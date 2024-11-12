'use client';

import { AlertRoot as CUIAlert, AlertRootProps as CUIAlertRootProps } from '@chakra-ui/react';
import { forwardRef } from 'react';

import { UIComponent } from './types';

export type AlertProps = CUIAlertRootProps & UIComponent;
export const Alert = forwardRef<HTMLDivElement, AlertProps>(({ children, size, ...rest }, ref) => (
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
