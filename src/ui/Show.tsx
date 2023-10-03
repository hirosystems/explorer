import { Show as CUIShow, ShowProps as CUIShowProps } from '@chakra-ui/react';

export function Show({ children, ...rest }: CUIShowProps) {
  return <CUIShow {...rest}>{children}</CUIShow>;
}
