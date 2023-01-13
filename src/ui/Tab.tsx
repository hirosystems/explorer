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
    borderRadius={'12px'}
    fontSize={'16px'}
    color={`textCaption.${useColorMode().colorMode}`}
    p={'10px 20px'}
    _selected={{
      bg: `bg4.${useColorMode().colorMode}`,
      color: `textTitle.${useColorMode().colorMode}`,
    }}
    {...rest}
  >
    {children}
  </CUITab>
));
