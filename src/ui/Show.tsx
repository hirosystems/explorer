'use client';

import { Show as CUIShow, ShowProps as CUIShowProps } from '@chakra-ui/react';
import { FC } from 'react';

export const Show: FC<CUIShowProps> = ({ children, ...rest }) => (
  <CUIShow {...rest}>{children}</CUIShow>
);
