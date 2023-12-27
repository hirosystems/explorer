'use client';

import {
  Switch as CUISwitch,
  SwitchProps as CUISwitchProps,
  forwardRef,
  useColorMode,
} from '@chakra-ui/react';

import { UIComponent } from './types';

export type SwitchProps = CUISwitchProps & UIComponent;
export const Switch = forwardRef<SwitchProps, 'div'>(({ children, size, ...rest }, ref) => (
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
));
