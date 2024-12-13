'use client';

import { Flex as CUIFlex, FlexProps as CUIFlexProps } from '@chakra-ui/react';
import { forwardRef } from 'react';

import { UIComponent } from './types';

export type FlexProps = CUIFlexProps & UIComponent;
export const Flex = forwardRef<HTMLDivElement, FlexProps>(({ children, ...rest }, ref) => (
  <CUIFlex ref={ref} {...rest}>
    {children}
  </CUIFlex>
));
