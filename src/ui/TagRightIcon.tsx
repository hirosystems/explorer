'use client';

import {
  TagRightIcon as CUITagRightIcon,
  IconProps as CUITagRightIconProps,
  forwardRef,
} from '@chakra-ui/react';

import { UIComponent } from './types';

export type TagRightIconProps = CUITagRightIconProps & UIComponent;
export const TagRightIcon = forwardRef<TagRightIconProps, 'div'>(
  ({ children, size, ...rest }, ref) => (
    <CUITagRightIcon
      ref={ref}
      width={size || rest.width}
      height={size || rest.height}
      minWidth={size || rest.minWidth}
      minHeight={size || rest.minHeight}
      {...rest}
    >
      {children}
    </CUITagRightIcon>
  )
);
