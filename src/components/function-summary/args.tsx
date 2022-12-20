import * as React from 'react';

import { ContractCallTransaction } from '@stacks/stacks-blockchain-api-types';
import { Box, Flex } from '@stacks/ui';

import { Singleton } from '@common/types/utils';

import { FunctionSummaryClarityValue } from '@components/function-summary/value';
import { Row } from '@components/rows/row';
import { Pre, Text } from '@components/typography';

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
        const isLast = key === args.length - 1;
        return (
          <Row
            flexGrow={1}
            alignItems="center"
            width="100%"
            py={key === 0 ? undefined : 'base'}
            pb={isLast ? 'none' : 'base'}
            borderBottom={isLast ? 'none' : '1px solid'}
            key={key}
          >
            <Box width="100%" alignItems="center">
              <Flex mb="base" alignItems="center">
                <Pre>{arg.name}</Pre>
              </Flex>
              <FunctionSummaryClarityValue btc={btc} arg={arg} />
            </Box>
          </Row>
        );
      })}
    </Box>
  ) : (
    <Row py="none" borderBottom="none">
      <Text>This function has no arguments.</Text>
    </Row>
  );
};
