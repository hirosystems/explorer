'use client';

import { TabsRoot as CUITab, TabsRootProps as CUITabProps } from '@chakra-ui/react';
import { forwardRef } from 'react';

import { UIComponent } from './types';

export type TabProps = CUITabProps & UIComponent;
export const Tab = forwardRef<HTMLDivElement, TabProps>(({ children, size, ...rest }, ref) => (
  <CUITab
    ref={ref}
    width={size || rest.width}
    height={size || rest.height}
    minWidth={size || rest.minWidth}
    minHeight={size || rest.minHeight}
    {...rest}
  >
    {children}
  </CUITab>
));
