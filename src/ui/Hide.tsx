'use client';

import { Hide as CUIHide, HideProps as CUIHideProps } from '@chakra-ui/react';
import { FC } from 'react';

export const Hide: FC<CUIHideProps> = ({ children, ...rest }) => (
  <CUIHide {...rest}>{children}</CUIHide>
);
