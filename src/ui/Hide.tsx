import { Hide as CUIHide, HideProps as CUIHideProps } from '@chakra-ui/react';

export function Hide({ children, ...rest }: CUIHideProps) {
  return <CUIHide {...rest}>{children}</CUIHide>;
}
