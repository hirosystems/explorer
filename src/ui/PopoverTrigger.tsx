'use client';

import { PopoverTrigger as CUIPopoverTrigger } from '@chakra-ui/react';

export function PopoverTrigger({ children }: { children: React.ReactNode }) {
  return <CUIPopoverTrigger>{children}</CUIPopoverTrigger>;
}
