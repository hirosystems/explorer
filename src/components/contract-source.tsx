import * as React from 'react';
import { Box, BoxProps, CodeBlock } from '@blockstack/ui';
import { SectionTitle } from '@components/typography';

export const ContractSource = ({ source, ...rest }: { source?: string } & BoxProps) =>
  source ? (
    <Box {...rest}>
      <SectionTitle mb="base-loose">Contract source</SectionTitle>
      <CodeBlock border="1px solid var(--colors-border)" showLineNumbers code={source} />
    </Box>
  ) : null;
