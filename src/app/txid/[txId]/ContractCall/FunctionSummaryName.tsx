import { FC } from 'react';

import { ContractCallTransaction } from '@stacks/stacks-blockchain-api-types';

import { Flex, FlexProps } from '../../../../ui/Flex';
import { Icon } from '../../../../ui/Icon';
import { Text } from '../../../../ui/Text';
import FunctionXIcon from '../../../../ui/icons/FunctionX';

export const FunctionSummaryName: FC<
  { summary: ContractCallTransaction['contract_call'] } & FlexProps
> = ({ summary, ...rest }) => {
  return (
    <Flex width="100%" alignItems="center" justifyContent="space-between" {...rest}>
      <Flex>
        <Icon as={FunctionXIcon} mr="8px" size="18px" />
        <Text fontWeight="600" fontSize={'14px'}>
          {summary.function_name}
        </Text>
      </Flex>
    </Flex>
  );
};
