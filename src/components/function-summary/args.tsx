import * as React from 'react';
import { Box, Flex } from '@stacks/ui';
import { Pre, Text } from '@components/typography';
import { Row } from '@components/rows/row';
import { FunctionSummaryClarityValue } from '@components/function-summary/value';
import { ContractCallTransaction } from '@blockstack/stacks-blockchain-api-types';
import { Singleton } from '@common/types/utils';

type FunctionArg = Singleton<
  Required<Required<ContractCallTransaction['contract_call']>['function_args']>
>;

export const FunctionSummaryArguments: React.FC<{
  summary: ContractCallTransaction['contract_call'];
}> = ({ summary }) => {
  return summary.function_args ? (
    <Box width="100%">
      {summary.function_args.map((arg: FunctionArg, key: number) => {
        const isLast = summary?.function_args && key === summary?.function_args?.length - 1;
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
              <FunctionSummaryClarityValue arg={arg} />
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
