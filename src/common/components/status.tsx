'use client';

import { ReactNode } from 'react';

import { Badge, BadgeProps } from './Badge';

export function StyledBadge({ children, ...rest }: { children: ReactNode } & BadgeProps) {
  return (
    <Badge
      labelProps={{ display: 'flex', alignItems: 'center', gap: 1 }}
      bg={'purple.500'}
      color={'white'}
      gap={1}
      border={'none'}
      flexShrink={'0'}
      {...rest}
    >
      {children}
    </Badge>
  );
}
