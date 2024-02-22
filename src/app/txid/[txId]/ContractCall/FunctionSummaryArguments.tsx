import { css } from '@emotion/react';
import * as React from 'react';

import { ContractCallTransaction } from '@stacks/stacks-blockchain-api-types';

import { Singleton } from '../../../../common/types/utils';
import { Box } from '../../../../ui/Box';
import { Flex } from '../../../../ui/Flex';
import { Pre, Text } from '../../../../ui/typography';
import { FunctionSummaryClarityValue } from './FunctionSummaryClarityValue';

type FunctionArg = Singleton<
  Required<Required<ContractCallTransaction['contract_call']>['function_args']>
>;

export const FunctionSummaryArguments: React.FC<{
  summary: ContractCallTransaction['contract_call'];
  btc: null | string;
}> = ({ summary, btc }) => {
  const args = (summary?.function_args || []).filter(arg => !!arg);
  return summary.function_args ? (
    <Box width="100%">
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
