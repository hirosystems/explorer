import * as React from 'react';

import { Box, BoxProps, color, Flex, Grid } from '@stacks/ui';
import { Caption, SectionTitle, Text } from '@components/typography';

import { CodeBlock } from '@components/code-block';
import { border } from '@common/utils';
import { Badge } from './badge';
import { CodeIcon } from './icons/code';
import { TxLink } from '@components/links';

export const ContractSource: React.FC<{ sourceTx?: string; source?: string } & BoxProps> = ({
  sourceTx,
  source,
  ...rest
}) => {
  const [expanded, setExpanded] = React.useState(false);
  const handleToggleExpanded = React.useCallback(() => {
    setExpanded(s => !s);
  }, [setExpanded]);

  const sourceLines =
    source?.split(`
`).length || 0;

  return source ? (
    <Box {...rest}>
      <Box border="1px solid var(--colors-border)" borderRadius="12px" overflow="hidden" bg="ink">
        <Flex
          justifyContent="space-between"
          borderBottom={border()}
          borderBottomColor="rgb(39, 41, 46)"
          px="base"
          py="base"
          alignItems="center"
        >
          <Text color="white" fontWeight="500">
            Contract source
          </Text>
          {sourceTx ? (
            <TxLink txid={sourceTx}>
              <Badge
                as="a"
                _hover={{ bg: 'rgba(255,255,255,0.05)', cursor: 'pointer' }}
                border="1px solid rgb(39, 41, 46)"
                labelProps={{ display: 'flex', alignItems: 'center', fontWeight: 500 }}
                target="_blank"
              >
                <CodeIcon color="rgba(255,255,255,0.65)" strokeWidth="2" mr="tight" size="14px" />
                Go to original transaction
              </Badge>
            </TxLink>
          ) : null}
        </Flex>
        <CodeBlock
          overflow={!expanded ? 'hidden' : undefined}
          maxHeight={!expanded ? '256px' : undefined}
          borderRadius="0"
          showLineNumbers
          code={source}
        />
        <Box
          borderTop={border()}
          borderTopColor="rgb(39, 41, 46)"
          mt={sourceLines >= 10 && !expanded ? '16px' : 'unset'}
        >
          {sourceLines >= 10 ? (
            <Grid
              p="base"
              placeItems="center"
              opacity={0.65}
              onClick={handleToggleExpanded}
              _hover={{
                cursor: 'pointer',
                opacity: 1,
              }}
            >
              <Text color="white">{!expanded ? `See all ${sourceLines} lines` : 'Collapse'}</Text>
            </Grid>
          ) : null}
        </Box>
      </Box>
    </Box>
  ) : null;
};
