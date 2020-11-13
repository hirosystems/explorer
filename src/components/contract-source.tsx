import * as React from 'react';

import { Box, BoxProps, Flex, Grid } from '@stacks/ui';
import { Text } from '@components/typography';

import { CodeBlock } from '@components/code-block';
import { border } from '@common/utils';
import { Badge } from './badge';
import { CodeIcon } from './icons/code';
import { TxLink } from '@components/links';
import {
  ContractCallTransaction,
  MempoolContractCallTransaction,
} from '@blockstack/stacks-blockchain-api-types';
import { IconChevronRight } from '@tabler/icons';

export const ContractSource: React.FC<
  {
    sourceTx?: string;
    source?: string;
    contractCall?:
      | MempoolContractCallTransaction['contract_call']
      | ContractCallTransaction['contract_call'];
  } & BoxProps
> = ({ sourceTx, source, contractCall, ...rest }) => {
  const [expanded, setExpanded] = React.useState(false);
  const handleToggleExpanded = React.useCallback(() => {
    setExpanded(s => !s);
  }, [setExpanded]);

  const sourceLines =
    source?.split(`
`) || [];
  const sourceLinesLength = sourceLines.length || 0;
  const functionSigElements =
    (contractCall &&
      'function_signature' in contractCall &&
      contractCall?.function_signature.split(' ')) ||
    [];

  const start = functionSigElements?.length
    ? [functionSigElements[0], functionSigElements[1]].join(' ')
    : undefined;

  const functionLine = start ? sourceLines.findIndex(line => line.includes(start)) + 1 : undefined;

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
            Source code
          </Text>
          {sourceTx ? (
            <TxLink txid={sourceTx}>
              <Badge
                as="a"
                bg="rgba(255,255,255,0.12)"
                _hover={{ bg: 'rgba(255,255,255,0.2)', cursor: 'pointer' }}
                border="1px solid rgb(39, 41, 46)"
                labelProps={{ display: 'flex', alignItems: 'center', fontWeight: 500 }}
                target="_blank"
              >
                View deployment
                <Box ml="extra-tight" size="14px">
                  <IconChevronRight size="14px" />
                </Box>
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
          highlightedLine={functionLine}
        />
        <Box
          borderTop={border()}
          borderTopColor="rgb(39, 41, 46)"
          mt={sourceLinesLength >= 10 && !expanded ? '16px' : 'unset'}
        >
          {sourceLinesLength >= 10 ? (
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
              <Text color="white">
                {!expanded ? `See all ${sourceLinesLength} lines` : 'Collapse'}
              </Text>
            </Grid>
          ) : null}
        </Box>
      </Box>
    </Box>
  ) : null;
};
