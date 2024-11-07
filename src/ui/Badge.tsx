'use client';

import { Badge as CUIBadge, BadgeProps as CUIRBadgeProps, chakra } from '@chakra-ui/react';
import { forwardRef } from 'react';

import { badgeRecipe } from './theme/recipes/BadgeRecipe';
import { UIComponent } from './types';

export type BadgeProps = CUIRBadgeProps & UIComponent;
export const BadgeBase = forwardRef<HTMLDivElement, BadgeProps>(
  ({ children, size, ...rest }, ref) => (
    <CUIBadge ref={ref} {...rest}>
      {children}
    </CUIBadge>
  )
);

export const Badge = chakra(BadgeBase, badgeRecipe);
