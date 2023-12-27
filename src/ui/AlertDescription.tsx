'use client';

import {
  AlertDescription as CUIAlertDescription,
  AlertDescriptionProps as CUIAlertDescriptionProps,
  forwardRef,
  useColorMode,
} from '@chakra-ui/react';

import { UIComponent } from './types';

export type AlertDescriptionProps = CUIAlertDescriptionProps & UIComponent;
export const AlertDescription = forwardRef<AlertDescriptionProps, 'div'>(
  ({ children, size, ...rest }, ref) => (
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
  )
);
