import * as React from 'react';
import { Rows } from '@components/rows';
import { Section } from '@components/section';
import { FunctionSummaryName } from '@components/function-summary/function-name';
import { FunctionSummaryArguments } from '@components/function-summary/args';
import { FunctionSummaryResult } from '@components/function-summary/result';

export const FunctionSummarySection = ({
  summary,
  result,
  abi,
  ...rest
}: {
  result: any;
  summary: any;
  abi: any;
}) => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const abiData = abi.functions.find(func => func.name === summary.function_name);
  return (
    <Section title="Function called" {...rest}>
      <>
        <Rows
          px="base"
          noTopBorder
          items={[
            {
              label: {
                children: 'Function',
              },
              flexGrow: 1,
              children: <FunctionSummaryName summary={summary} abi={abiData} />,
            },
            {
              label: {
                children: 'Result',
              },
              flexGrow: 1,
              alignItems: 'flex-start',
              condition: result?.repr,
              children: <FunctionSummaryResult result={result} />,
            },
            {
              label: {
                children: 'Arguments',
              },
              alignItems: 'flex-start',
              flexGrow: 1,
              children: summary.function_args ? (
                <FunctionSummaryArguments summary={summary} abi={abiData} />
              ) : null,
            },
          ]}
        />
      </>
    </Section>
  );
};
