'use client';

import { ListItem as CUIListItem, ListItemProps as CUIListItemProps } from '@chakra-ui/react';
import { forwardRef } from 'react';

import { UIComponent } from './types';

export type ListItemProps = CUIListItemProps & UIComponent;
export const ListItem = forwardRef<HTMLLIElement, ListItemProps>(
  ({ children, size, ...rest }, ref) => (
    <CUIListItem
      ref={ref}
      width={size || rest.width}
      height={size || rest.height}
      minWidth={size || rest.minWidth}
      minHeight={size || rest.minHeight}
      {...rest}
    >
      {children}
    </CUIListItem>
  )
);
