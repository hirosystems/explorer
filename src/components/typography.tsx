import * as React from 'react';
import { Text, BoxProps } from '@blockstack/ui';

export const Caption: React.FC<BoxProps> = props => (
  <Text
    style={{ userSelect: 'none' }}
    color="ink.600"
    fontSize="12px"
    lineHeight="16px"
    display="inline-block"
    {...props}
  />
);

export const SectionTitle: React.FC<BoxProps> = props => (
  <Text lineHeight="28px" fontSize="20px" fontWeight="500" display="inline-block" {...props} />
);
