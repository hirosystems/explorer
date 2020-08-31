import * as React from 'react';
import { Box, BoxProps } from '@stacks/ui';
import { SectionTitle, Text } from '@components/typography';
import { CodeBlock } from '@components/code-block';

export const ContractSource = ({ source, ...rest }: { source?: string } & BoxProps) =>
  source ? (
    <Box {...rest}>
      <Box border="1px solid var(--colors-border)" borderRadius="12px" overflow="hidden" bg="ink">
        <Box borderBottom="1px solid" borderBottomColor="ink.900" p="base" pt="base">
          <Text color="white" fontWeight="500">
            Contract source
          </Text>
        </Box>
        <CodeBlock borderRadius="0" showLineNumbers code={source} />
      </Box>
    </Box>
  ) : null;
