import { PopoverTrigger as CUIPopoverTrigger } from '@chakra-ui/react';
import { ReactNode } from 'react';

export function PopoverTrigger({ children, ...rest }: { children: ReactNode }) {
  return <CUIPopoverTrigger {...rest}>{children}</CUIPopoverTrigger>;
}
