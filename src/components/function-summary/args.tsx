import * as React from 'react';
import { Box, Flex, Grid } from '@stacks/ui';
import { Pre, Text } from '@components/typography';
import { Row } from '@components/rows/row';
import { FunctionSummaryClarityValue } from '@components/function-summary/value';

export const FunctionSummaryArguments: React.FC<{ summary: any; abi: any }> = ({
  summary,
  abi,
}) => {
  return summary.function_args ? (
    <Box width="100%">
      {summary.function_args.map((arg: any, key: number) => (
        <Row
          flexGrow={1}
          alignItems="center"
          width="100%"
          py={key === 0 ? undefined : 'base'}
          pb={key === summary.function_args.length - 1 ? 'none' : 'base'}
          borderBottom={key === summary.function_args.length - 1 ? 'none' : '1px solid'}
          key={key}
        >
          <Box width="100%" alignItems="center">
            <Flex mb="base" alignItems="center">
              <Pre>{abi.args[key].name}</Pre>
            </Flex>
            <FunctionSummaryClarityValue arg={arg} />
          </Box>
        </Row>
      ))}
    </Box>
  ) : (
    <Row py="none" borderBottom="none">
      <Text>This function has no arguments.</Text>
    </Row>
  );
};
