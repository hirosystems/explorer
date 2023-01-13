'use client';

import { Icon as CUIIcon, IconProps as CUIIconProps, forwardRef } from '@chakra-ui/react';

import { UIComponent } from './types';

export type IconProps = CUIIconProps & UIComponent;
export const Icon = forwardRef<IconProps, 'div'>(({ children, size, ...rest }, ref) => (
  <CUIIcon
    ref={ref}
    size={size}
    width={size || rest.width}
    height={size || rest.height}
    minWidth={size || rest.minWidth}
    minHeight={size || rest.minHeight}
    {...rest}
  >
    {children}
  </CUIIcon>
));
