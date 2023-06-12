'use client';

import {
  TableCaption as CUITableCaption,
  TableCaptionProps as CUITableCaptionProps,
  forwardRef,
  useColorMode,
} from '@chakra-ui/react';

import { UIComponent } from './types';

export type TableCaptionProps = CUITableCaptionProps & UIComponent;
export const TableCaption = forwardRef<TableCaptionProps, 'div'>(
  ({ children, size, ...rest }, ref) => (
    <CUITableCaption
      ref={ref}
      width={size || rest.width}
      height={size || rest.height}
      minWidth={size || rest.minWidth}
      minHeight={size || rest.minHeight}
      borderColor={`border.${useColorMode().colorMode}`}
      {...rest}
    >
      {children}
    </CUITableCaption>
  )
);
