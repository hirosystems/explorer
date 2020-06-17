import * as React from 'react';
import { Text as BaseText, BoxProps } from '@blockstack/ui';

export const Text = React.forwardRef((props: BoxProps, ref) => (
  <BaseText ref={ref} color="var(--colors-text-body)" {...props} />
));

export const Caption: React.FC<BoxProps> = props => (
  <Text
    style={{ userSelect: 'none' }}
    color="var(--colors-text-caption)"
    fontSize="12px"
    lineHeight="16px"
    display="inline-block"
    {...props}
  />
);

export const Title: React.FC<BoxProps> = React.memo(props => (
  <Text display="inline-block" {...props} color="var(--colors-text-title)" />
));

export const SectionTitle: React.FC<BoxProps> = React.memo(props => (
  <Title lineHeight="28px" fontSize="20px" fontWeight="500" {...props} />
));

export const Pre = React.memo(
  React.forwardRef((props: BoxProps, ref) => (
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

type LinkProps = BoxProps & Partial<React.AnchorHTMLAttributes<HTMLAnchorElement>>;

export const Link = React.forwardRef(({ _hover = {}, ...props }: LinkProps, ref) => (
  <Text
    _hover={{
      textDecoration: 'underline',
      ..._hover,
    }}
    ref={ref}
    {...props}
  />
));
