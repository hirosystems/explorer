'use client';

import { Badge as CUIBadge } from '@chakra-ui/react';
import { chakra } from '@chakra-ui/react';

import { badgeRecipe } from './theme/componentTheme/Badge';

// export type BadgeProps = CUIBadgeProps & UIComponent;
// export const Badge = forwardRef<BadgeProps, 'div'>(({ children, size, ...rest }, ref) => (
//   <CUIBadge
//     ref={ref}
//     width={size || rest.width}
//     height={size || rest.height}
//     minWidth={size || rest.minWidth}
//     minHeight={size || rest.minHeight}
//     {...rest}
//   >
//     {children}
//   </CUIBadge>
// ));

export const Badge = chakra(CUIBadge, badgeRecipe);
