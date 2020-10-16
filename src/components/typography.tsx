import * as React from 'react';

import { Text as BaseText, BoxProps } from '@stacks/ui';
import { ForwardRefExoticComponentWithAs, forwardRefWithAs, memoWithAs } from '@stacks/ui-core';

export const Text: ForwardRefExoticComponentWithAs<BoxProps, 'span'> = forwardRefWithAs<
  BoxProps,
  'span'
>(({ as = 'span', ...rest }, ref) => <BaseText as={as} ref={ref} color="currentColor" {...rest} />);

export const Caption: ForwardRefExoticComponentWithAs<BoxProps, 'span'> = forwardRefWithAs<
  BoxProps,
  'span'
>((props, ref) => (
  <Text
    style={{ userSelect: 'none' }}
    color="var(--colors-text-caption)"
    fontSize="12px"
    lineHeight="16px"
    display="inline-block"
    ref={ref}
    {...props}
  />
));

export const Title: ForwardRefExoticComponentWithAs<BoxProps, 'span'> = forwardRefWithAs<
  BoxProps,
  'span'
>(({ as, ...props }, ref) => (
  <Text
    ref={ref}
    as={as}
    display="inline-block"
    color="var(--colors-text-title)"
    fontFamily={`"Open Sauce", Inter, sans-serif`}
    fontWeight={500}
    {...props}
  />
));

export const SectionTitle: React.FC<BoxProps> = forwardRefWithAs<BoxProps, 'span'>((props, ref) => (
  <Title ref={ref} lineHeight="28px" fontSize="20px" fontWeight="500" {...props} />
));

export const Pre = memoWithAs<BoxProps, 'pre'>(
  forwardRefWithAs<BoxProps, 'pre'>(({ as = 'pre', ...props }, ref) => (
    <Text
      fontFamily={`"Fira Code", monospace`}
      bg="var(--colors-bg-light)"
      borderRadius="3px"
      px="extra-tight"
      border="1px solid var(--colors-border)"
      fontSize="12px"
      ref={ref}
      {...props}
      style={{
        wordBreak: 'break-word',
      }}
    />
  ))
);

export const Link: ForwardRefExoticComponentWithAs<BoxProps, 'a'> = forwardRefWithAs<BoxProps, 'a'>(
  ({ as = 'a', _hover = {}, ...props }, ref) => (
    <Text
      _hover={{
        textDecoration: 'underline',
        ..._hover,
      }}
      as={as}
      ref={ref}
      {...props}
    />
  )
);
