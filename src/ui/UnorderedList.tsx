'use client';

import { ListRoot as CUIList, ListRootProps as CUIListProps } from '@chakra-ui/react';
import { forwardRef } from 'react';

import { UIComponent } from './types';

export type UnorderedListProps = CUIListProps & UIComponent;
export const UnorderedList = forwardRef<HTMLUListElement, UnorderedListProps>(
  ({ children, size, ...rest }, ref) => (
    <CUIList
      as="ul"
      ref={ref}
      width={size || rest.width}
      height={size || rest.height}
      minWidth={size || rest.minWidth}
      minHeight={size || rest.minHeight}
      {...rest}
    >
      {children}
    </CUIList>
  )
);
