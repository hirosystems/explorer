'use client';

import { Fade as CUIFade, FadeProps as CUIFadeProps, forwardRef } from '@chakra-ui/react';

export type FadeProps = CUIFadeProps;
export const Fade = forwardRef<FadeProps, 'div'>(({ children, ...rest }, ref) => (
  <CUIFade ref={ref} {...rest}>
    {children}
  </CUIFade>
));
