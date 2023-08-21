'use client';

import { PopoverTrigger as CUIPopoverTrigger } from '@chakra-ui/react';
import { FC } from 'react';

export const PopoverTrigger: FC = ({ children, ...rest }) => (
  <CUIPopoverTrigger {...rest}>{children}</CUIPopoverTrigger>
);
