'use client';

import {
  TagLeftIcon as CUITagLeftIcon,
  IconProps as CUITagLeftIconProps,
  forwardRef,
} from '@chakra-ui/react';

import { UIComponent } from './types';

export type TagLeftIconProps = CUITagLeftIconProps & UIComponent;
export const TagLeftIcon = forwardRef<TagLeftIconProps, 'div'>(
  ({ children, size, ...rest }, ref) => (
    <CUITagLeftIcon
      ref={ref}
      width={size || rest.width}
      height={size || rest.height}
      minWidth={size || rest.minWidth}
      minHeight={size || rest.minHeight}
      {...rest}
    >
      {children}
    </CUITagLeftIcon>
  )
);
