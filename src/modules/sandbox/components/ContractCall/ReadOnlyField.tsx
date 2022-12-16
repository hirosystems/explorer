import React, { FC, ReactNode } from 'react';
import { useQuery } from 'react-query';

import { ClarityAbiFunction, ClarityValue } from '@stacks/transactions';
import { Box, Button, Flex } from '@stacks/ui';

import { useNetworkConfig } from '@common/hooks/use-network-config';

import { CodeBlock } from '@components/code-block';
import { Section } from '@components/section';

import { useUser } from '@modules/sandbox/hooks/useUser';
import { callReadOnlyFunction, parseReadOnlyResponse } from '@modules/sandbox/utils';

interface ReadOnlyProps {
  readOnlyValue: ClarityValue[];
  contractId: string;
  fn: ClarityAbiFunction;
  cancelButton: ReactNode;
}

export const ReadOnlyField: FC<ReadOnlyProps> = ({
  readOnlyValue,
  contractId,
  fn,
  cancelButton,
}) => {
  const { stxAddress } = useUser();
  const stacksNetwork = useNetworkConfig();

  const { data } = useQuery(['readonly', contractId, fn.name], () =>
    callReadOnlyFunction({
      contractName: contractId.split('.')[1],
      contractAddress: contractId.split('.')[0],
      functionName: fn.name,
      functionArgs: readOnlyValue,
      network: stacksNetwork,
      senderAddress: stxAddress,
    })
  );

  if (!data) return null;

  return (
    <Box p="base">
      {data.okay ? (
        <Section title="Response">
          <CodeBlock code={parseReadOnlyResponse(data)} />
        </Section>
      ) : (
        <Box>{data.result}</Box>
      )}
      <Flex alignItems="center" justifyContent="center" pt="base">
        {cancelButton}
      </Flex>
    </Box>
  );
};
