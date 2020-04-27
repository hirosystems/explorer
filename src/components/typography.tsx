import * as React from 'react';
import { Text, BoxProps } from '@blockstack/ui';
import { useDarkMode } from '@common/hooks/use-dark-mode';

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

export const Title: React.FC<BoxProps> = props => (
  <Text color="var(--colors-text-title)" display="inline-block" {...props} />
);

export const SectionTitle: React.FC<BoxProps> = props => (
  <Title lineHeight="28px" fontSize="20px" fontWeight="500" {...props} />
);
