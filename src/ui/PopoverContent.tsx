'use client';

import {
  PopoverContent as CUIPopoverContent,
  PopoverContentProps as CUIPopoverContentProps,
} from '@chakra-ui/react';
import { forwardRef } from 'react';

import { UIComponent } from './types';

export type PopoverContentProps = CUIPopoverContentProps & UIComponent;
export const PopoverContent = forwardRef<HTMLDivElement, PopoverContentProps>(
  ({ children, size, ...rest }, ref) => (
    <CUIPopoverContent
      ref={ref}
      width={size || rest.width}
      height={size || rest.height}
      minWidth={size || rest.minWidth}
      minHeight={size || rest.minHeight}
      {...rest}
    >
      {children}
    </CUIPopoverContent>
  )
);
