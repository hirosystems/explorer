import * as React from 'react';
import { Rows } from '@components/rows';
import { Section } from '@components/section';
import { FunctionSummaryName } from '@components/function-summary/function-name';
import { FunctionSummaryArguments } from '@components/function-summary/args';
import { FunctionSummaryResult } from '@components/function-summary/result';
import { ContractCallTransaction } from '@stacks/stacks-blockchain-api-types';
import { memo, useMemo } from 'react';

export const FunctionSummarySection = memo<{
  result?: any;
  summary: ContractCallTransaction['contract_call'];
  isPending?: boolean;
  btc: null | string;
  txStatus: string | undefined;
}>(({ summary, result, isPending, btc, txStatus, ...rest }) => {
  const items = useMemo(
    () => [
      {
        label: {
          children: 'Function',
        },
        flexGrow: 1,
        children: <FunctionSummaryName summary={summary} />,
      },
      {
        label: {
          children: 'Result',
        },
        flexGrow: 1,
        alignItems: 'flex-start',
        condition: !isPending && result?.repr,
        children: <FunctionSummaryResult result={result} txStatus={txStatus} />,
      },
      {
        label: {
          children: 'Arguments',
        },
        alignItems: 'flex-start',
        flexGrow: 1,
        children: summary.function_args ? (
          <FunctionSummaryArguments btc={btc} summary={summary} />
        ) : null,
      },
    ],
    [summary, isPending, result]
  );
  return (
    <Section title="Function called" {...rest}>
      <Rows px="base" noTopBorder items={items} />
    </Section>
  );
});
