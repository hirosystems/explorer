'use client';

import { SwitchRoot as CUISwitch, SwitchRootProps as CUISwitchProps } from '@chakra-ui/react';
import { forwardRef } from 'react';

import { UIComponent } from './types';

export type SwitchProps = CUISwitchProps & UIComponent;
export const Switch = forwardRef<HTMLLabelElement, SwitchProps>(
  ({ children, size, ...rest }, ref) => (
    <CUISwitch
      ref={ref}
      width={size || rest.width}
      height={size || rest.height}
      minWidth={size || rest.minWidth}
      minHeight={size || rest.minHeight}
      position={'relative'}
      top={'1px'}
      {...rest}
    >
      {children}
    </CUISwitch>
  )
);
