'use client';

import {
  ListItem as CUIListItem,
  ListItemProps as CUIListItemProps,
  forwardRef,
  useColorMode,
} from '@chakra-ui/react';

import { UIComponent } from './types';

export type ListItemProps = CUIListItemProps & UIComponent;
export const ListItem = forwardRef<ListItemProps, 'li'>(({ children, size, ...rest }, ref) => (
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
));
