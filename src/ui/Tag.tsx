'use client';

import { TagRoot as CUITag, TagRootProps as CUITagProps } from '@chakra-ui/react';
import { forwardRef } from 'react';

import { UIComponent } from './types';

export type TagProps = CUITagProps & UIComponent;
export const Tag = forwardRef<HTMLDivElement, TagProps>(({ children, size, ...rest }, ref) => (
  <CUITag
    ref={ref}
    width={size || rest.width}
    height={size || rest.height}
    minWidth={size || rest.minWidth}
    minHeight={size || rest.minHeight}
    {...rest}
  >
    {children}
  </CUITag>
));
