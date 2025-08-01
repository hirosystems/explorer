import { CopyButtonRedesign } from '@/common/components/CopyButton';
import { Text } from '@/ui/Text';
import { Flex } from '@chakra-ui/react';

import { ContractCallTransaction } from '@stacks/stacks-blockchain-api-types';

import { formatFunctionResult } from './utils';

export const FunctionResultNonTuple = ({ tx }: { tx: ContractCallTransaction }) => {
  const result = tx.tx_result;
  const formattedResult = formatFunctionResult(result);
  const firstFormattedResult = formattedResult[0];
  if (!firstFormattedResult) return null;
  const { value, type } = firstFormattedResult;
  return (
    <Flex alignItems="center" gap={1}>
      <Text textStyle="text-regular-sm" color="textPrimary">
        {value}
      </Text>
      <Text textStyle="text-regular-sm" color="textPrimary">
        {type}
      </Text>
      <CopyButtonRedesign
        initialValue={`${value} ${type}`}
        aria-label={`copy function result`}
        iconProps={{
          height: 3.5,
          width: 3.5,
        }}
        buttonProps={{
          p: 1.5,
        }}
      />
    </Flex>
  );
};
