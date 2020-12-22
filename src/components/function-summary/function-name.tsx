import * as React from 'react';
import { Box, Flex, FlexProps } from '@stacks/ui';
import { Caption, Text } from '@components/typography';
import { capitalize } from '@common/utils';
import FunctionIcon from 'mdi-react/FunctionIcon';

export const FunctionSummaryName: React.FC<{ abi: any; summary: any } & FlexProps> = ({
  summary,
  abi,
  ...rest
}) => {
  return (
    <Flex width="100%" alignItems="center" justifyContent="space-between" {...rest}>
      <Flex>
        <Box as={FunctionIcon} mr="tight" size="18px" />
        <Text fontWeight="600">{summary.function_name}</Text>
      </Flex>
      <Caption>{capitalize(abi.access)} function</Caption>
    </Flex>
  );
};
