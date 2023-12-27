'use client';

import {
  Badge as CUIBadge,
  BadgeProps as CUIBadgeProps,
  forwardRef,
  useColorMode,
} from '@chakra-ui/react';

import { UIComponent } from './types';

export type BadgeProps = CUIBadgeProps & UIComponent;
export const Badge = forwardRef<BadgeProps, 'div'>(({ children, size, ...rest }, ref) => (
  <CUIBadge
    ref={ref}
    width={size || rest.width}
    height={size || rest.height}
    minWidth={size || rest.minWidth}
    minHeight={size || rest.minHeight}
    {...rest}
  >
    {children}
  </CUIBadge>
));
