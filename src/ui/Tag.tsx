'use client';

import { Tag as CUITag, TagProps as CUITagProps, forwardRef, useColorMode } from '@chakra-ui/react';

import { UIComponent } from './types';

export type TagProps = CUITagProps & UIComponent;
export const Tag = forwardRef<TagProps, 'div'>(({ children, size, ...rest }, ref) => (
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
