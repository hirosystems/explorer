'use client';

import {
  TagEndElement as CUITagEndElement,
  TagEndElementProps as CUITagEndElementProps,
} from '@chakra-ui/react';
import { forwardRef } from 'react';

import { UIComponent } from './types';

export type TagEndElementProps = CUITagEndElementProps & UIComponent;
export const TagEndElement = forwardRef<HTMLDivElement, TagEndElementProps>(
  ({ children, size, ...rest }, ref) => (
    <CUITagEndElement
      ref={ref}
      width={size || rest.width}
      height={size || rest.height}
      minWidth={size || rest.minWidth}
      minHeight={size || rest.minHeight}
      {...rest}
    >
      {children}
    </CUITagEndElement>
  )
);
