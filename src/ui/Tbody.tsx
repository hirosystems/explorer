'use client';

import {
  Tbody as CUITbody,
  TableBodyProps as CUITbodyProps,
  forwardRef,
  useColorMode,
} from '@chakra-ui/react';

import { UIComponent } from './types';

export type TbodyProps = CUITbodyProps & UIComponent;
export const Tbody = forwardRef<TbodyProps, 'tbody'>(({ children, size, ...rest }, ref) => (
  <CUITbody
    ref={ref}
    width={size || rest.width}
    height={size || rest.height}
    minWidth={size || rest.minWidth}
    minHeight={size || rest.minHeight}
    {...rest}
  >
    {children}
  </CUITbody>
));
