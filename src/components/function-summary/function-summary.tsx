import { FunctionSummaryArguments } from '@/components/function-summary/args';
import { FunctionSummaryName } from '@/components/function-summary/function-name';
import { FunctionSummaryResult } from '@/components/function-summary/result';
import { Section } from '@/components/section';
import { Box, Flex } from '@/ui/components';
import * as React from 'react';
import { memo } from 'react';

import { ContractCallTransaction } from '@stacks/stacks-blockchain-api-types';

import { KeyValueHorizontal } from '../../app/common/components/KeyValueHorizontal';
import { useVerticallyStackedElementsBorderStyle } from '../../app/common/styles/border';

export const FunctionSummarySection = memo<{
  result?: any;
  summary: ContractCallTransaction['contract_call'];
  btc: null | string;
  txStatus: string | undefined;
}>(({ summary, result, btc, txStatus }) => {
  return (
    <Section title="Function called">
      <Flex px="16px" width="100%" flexDirection={['column', 'column', 'row']}>
        <Box width={['100%']} css={useVerticallyStackedElementsBorderStyle}>
          <KeyValueHorizontal
            label="Function"
            value={<FunctionSummaryName summary={summary} />}
            labelProps={{ alignSelf: 'flex-start' }}
          />
          <KeyValueHorizontal
            label="Result"
            value={<FunctionSummaryResult result={result} txStatus={txStatus} />}
            labelProps={{ alignSelf: 'flex-start' }}
          />
          <KeyValueHorizontal
            label="Arguments"
            value={<FunctionSummaryArguments btc={btc} summary={summary} />}
            labelProps={{ alignSelf: 'flex-start' }}
          />
        </Box>
      </Flex>
    </Section>
  );
});
