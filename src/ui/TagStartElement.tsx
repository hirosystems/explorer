'use client';

import {
  TagStartElement as CUITagStartElement,
  TagStartElementProps as CUITagStartElementProps,
} from '@chakra-ui/react';
import { forwardRef } from 'react';

import { UIComponent } from './types';

export type TagStartElementProps = CUITagStartElementProps & UIComponent;
export const TagStartElement = forwardRef<HTMLDivElement, TagStartElementProps>(
  ({ children, size, ...rest }, ref) => (
    <CUITagStartElement
      ref={ref}
      width={size || rest.width}
      height={size || rest.height}
      minWidth={size || rest.minWidth}
      minHeight={size || rest.minHeight}
      {...rest}
    >
      {children}
    </CUITagStartElement>
  )
);
