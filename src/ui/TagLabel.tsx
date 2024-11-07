'use client';

import { TagLabel as CUITagLabel, TagLabelProps as CUITagLabelProps } from '@chakra-ui/react';
import { forwardRef } from 'react';

import { UIComponent } from './types';

export type TagLabelProps = CUITagLabelProps & UIComponent;
export const TagLabel = forwardRef<HTMLDivElement, TagLabelProps>(
  ({ children, size, ...rest }, ref) => (
    <CUITagLabel
      ref={ref}
      width={size || rest.width}
      height={size || rest.height}
      minWidth={size || rest.minWidth}
      minHeight={size || rest.minHeight}
      {...rest}
    >
      {children}
    </CUITagLabel>
  )
);
