'use client';

import { forwardRef } from 'react';

import { Text, TextProps } from './Text';

export * from './Text';

export const Caption = forwardRef<HTMLParagraphElement, TextProps>((props, ref) => (
  <Text style={{ userSelect: 'none' }} fontSize="xs" display="inline-block" ref={ref} {...props} />
));

export const Title = forwardRef<HTMLParagraphElement, TextProps>(({ as, ...props }, ref) => (
  <Text ref={ref} as={as} display="inline-block" fontWeight={'medium'} {...props} />
));

export const Pre = forwardRef<HTMLParagraphElement, TextProps>(({ as = 'pre', ...props }, ref) => (
  <Text
    display="inline-block"
    fontFamily={`"Fira Code", monospace`}
    borderRadius="8px"
    borderWidth="1px"
    fontSize="xs"
    boxShadow="low"
    px={2}
    py={2}
    ref={ref}
    {...props}
    style={{
      wordBreak: 'break-word',
    }}
  />
));
