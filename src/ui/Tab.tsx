'use client';

import { Tab as CUITab, TabProps as CUITabProps, forwardRef, useColorMode } from '@chakra-ui/react';

import { UIComponent } from './types';

export type TabProps = CUITabProps & UIComponent;
export const Tab = forwardRef<TabProps, 'div'>(({ children, size, ...rest }, ref) => (
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
