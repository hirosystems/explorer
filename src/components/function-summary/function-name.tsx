import { Flex, FlexProps, Icon } from '@/ui/components';
import { FunctionIcon } from '@/ui/icons';
import { Text } from '@/ui/typography';
import * as React from 'react';

import { ContractCallTransaction } from '@stacks/stacks-blockchain-api-types';

export const FunctionSummaryName: React.FC<
  { summary: ContractCallTransaction['contract_call'] } & FlexProps
> = ({ summary, ...rest }) => {
  return (
    <Flex width="100%" alignItems="center" justifyContent="space-between" {...rest}>
      <Flex>
        <Icon as={FunctionIcon} mr="8px" size="18px" />
        <Text fontWeight="600" fontSize={'14px'}>
          {summary.function_name}
        </Text>
      </Flex>
    </Flex>
  );
};
