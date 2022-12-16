import FunctionIcon from 'mdi-react/FunctionIcon';
import * as React from 'react';

import { ContractCallTransaction } from '@stacks/stacks-blockchain-api-types';
import { Box, Flex, FlexProps } from '@stacks/ui';

import { Text } from '@components/typography';

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
