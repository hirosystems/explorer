import { css } from '@emotion/react';

import { ContractCallTransaction } from '@stacks/stacks-blockchain-api-types';
import { Singleton } from '@/common/types/utils';
import { FunctionSummaryClarityValue } from '@/components/function-summary/value';
import { Box, Flex } from '@/ui/components';
import { Pre, Text } from '@/ui/typography';

import { useVerticallyStackedElementsBorderStyle } from '../../appPages/common/styles/border';
import { FunctionArg } from '@/common/types/tx';

export function FunctionSummaryArguments({
  summary,
  btc,
}: {
  summary: ContractCallTransaction['contract_call'];
  btc: null | string;
}) {
  const args = (summary?.function_args || []).filter(arg => !!arg);
  return summary.function_args ? (
    <Box width="100%" css={useVerticallyStackedElementsBorderStyle}>
      {args.map((arg: FunctionArg, key: number) => {
        return (
          <Flex
            key={key}
            gap="16px"
            direction="column"
            pb="16px"
            mb="16px"
            css={css`
              &:last-child {
                margin-bottom: 0;
                padding-bottom: 0;
              }
            `}
          >
            <Flex alignItems="center">
              <Pre>{arg.name}</Pre>
            </Flex>
            <FunctionSummaryClarityValue btc={btc} arg={arg} />
          </Flex>
        );
      })}
    </Box>
  ) : (
    <Flex>
      <Text>This function has no arguments.</Text>
    </Flex>
  );
}
