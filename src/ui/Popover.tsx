'use client';

import { Popover as CUIPopover, PopoverProps as CUIPopoverProps } from '@chakra-ui/react';

import { UIComponent } from './types';

export type PopoverProps = CUIPopoverProps & UIComponent;
export const Popover = ({ children, ...rest }: PopoverProps) => (
  <CUIPopover {...rest}>{children}</CUIPopover>
);
