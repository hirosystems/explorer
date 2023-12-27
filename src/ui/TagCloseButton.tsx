'use client';

import {
  TagCloseButton as CUITagCloseButton,
  TagCloseButtonProps as CUITagCloseButtonProps,
  forwardRef,
} from '@chakra-ui/react';

import { UIComponent } from './types';

export type TagCloseButtonProps = CUITagCloseButtonProps & UIComponent;
export const TagCloseButton = forwardRef<TagCloseButtonProps, 'div'>(
  ({ children, size, ...rest }, ref) => (
    <CUITagCloseButton
      ref={ref}
      width={size || rest.width}
      height={size || rest.height}
      minWidth={size || rest.minWidth}
      minHeight={size || rest.minHeight}
      {...rest}
    >
      {children}
    </CUITagCloseButton>
  )
);
