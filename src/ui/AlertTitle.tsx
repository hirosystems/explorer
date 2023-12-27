'use client';

import {
  AlertTitle as CUIAlertTitle,
  AlertTitleProps as CUIAlertTitleProps,
  forwardRef,
} from '@chakra-ui/react';

import { UIComponent } from './types';

export type AlertTitleProps = CUIAlertTitleProps & UIComponent;
export const AlertTitle = forwardRef<AlertTitleProps, 'div'>(({ children, size, ...rest }, ref) => (
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
));
