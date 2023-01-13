'use client';

import {
  TabList as CUITabList,
  TabListProps as CUITabListProps,
  forwardRef,
  useColorMode,
} from '@chakra-ui/react';

import { UIComponent } from './types';

export type TabListProps = CUITabListProps & UIComponent;
export const TabList = forwardRef<TabListProps, 'div'>(({ children, size, ...rest }, ref) => (
  <CUITabList
    ref={ref}
    width={size || rest.width}
    height={size || rest.height}
    minWidth={size || rest.minWidth}
    minHeight={size || rest.minHeight}
    p={'12px 16px'}
    borderBottom={`1px solid var(--stacks-colors-border-${useColorMode().colorMode})`}
    {...rest}
  >
    {children}
  </CUITabList>
));
