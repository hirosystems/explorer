'use client';

import {
  Image as CUIImage,
  ImageProps as CUIImageProps,
  forwardRef,
  useColorMode,
} from '@chakra-ui/react';

import { UIComponent } from './types';

export type ImageProps = CUIImageProps & UIComponent;
export const Image = forwardRef<ImageProps, 'img'>(({ size, ...rest }, ref) => (
  <CUIImage
    ref={ref}
    width={size || rest.width}
    height={size || rest.height}
    minWidth={size || rest.minWidth}
    minHeight={size || rest.minHeight}
    {...rest}
  />
));
