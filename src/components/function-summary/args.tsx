import { Singleton } from '@/common/types/utils';
import { FunctionSummaryClarityValue } from '@/components/function-summary/value';
import { Box, Flex } from '@/ui/components';
import { Pre, Text } from '@/ui/typography';
import { css } from '@emotion/react';
import * as React from 'react';

import { ContractCallTransaction } from '@stacks/stacks-blockchain-api-types';

import { useVerticallyStackedElementsBorderStyle } from '../../app/common/styles/border';

type FunctionArg = Singleton<
  Required<Required<ContractCallTransaction['contract_call']>['function_args']>
>;

export const FunctionSummaryArguments: React.FC<{
  summary: ContractCallTransaction['contract_call'];
  btc: null | string;
}> = ({ summary, btc }) => {
  const args = (summary?.function_args || []).filter(arg => !!arg);
  return summary.function_args ? (
    <Box width="100%" css={useVerticallyStackedElementsBorderStyle}>
      {args.map((arg: FunctionArg, key: number) => {
        return (
          <Flex
            key={key}
            gap={'16px'}
            direction={'column'}
            pb={'16px'}
            mb={'16px'}
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
};
