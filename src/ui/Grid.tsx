'use client';

import { Grid as CUIGrid, GridProps as CUIGridProps } from '@chakra-ui/react';
import { forwardRef } from 'react';

import { UIComponent } from './types';

export type GridProps = CUIGridProps & UIComponent;
export const Grid = forwardRef<HTMLDivElement, GridProps>(({ children, size, ...rest }, ref) => (
  <CUIGrid
    ref={ref}
    width={size || rest.width}
    height={size || rest.height}
    minWidth={size || rest.minWidth}
    minHeight={size || rest.minHeight}
    {...rest}
  >
    {children}
  </CUIGrid>
));
