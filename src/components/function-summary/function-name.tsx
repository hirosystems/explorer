import * as React from 'react';
import { Box, Flex, FlexProps } from '@stacks/ui';
import { Text } from '@components/typography';
import FunctionIcon from 'mdi-react/FunctionIcon';
import { ContractCallTransaction } from '@blockstack/stacks-blockchain-api-types';

export const FunctionSummaryName: React.FC<
  { summary: ContractCallTransaction['contract_call'] } & FlexProps
> = ({ summary, ...rest }) => {
  return (
    <Flex width="100%" alignItems="center" justifyContent="space-between" {...rest}>
      <Flex>
        <Box as={FunctionIcon} mr="tight" size="18px" />
        <Text fontWeight="600">{summary.function_name}</Text>
      </Flex>
    </Flex>
  );
};
