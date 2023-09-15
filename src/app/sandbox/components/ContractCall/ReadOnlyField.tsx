'use client';

import { Section } from '@/components/section';
import { CodeEditor } from '@/ui/CodeEditor';
import { Box, Flex } from '@/ui/components';
import React, { FC, ReactNode } from 'react';
import { useQuery } from '@tanstack/react-query';

import { ClarityAbiFunction, ClarityValue } from '@stacks/transactions';

import { useStacksNetwork } from '../../../common/hooks/use-stacks-network';
import { useUser } from '../../hooks/useUser';
import { callReadOnlyFunction, parseReadOnlyResponse } from '../../utils';

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
  const stacksNetwork = useStacksNetwork();

  const { data } = useQuery(
    ['readonly', contractId, fn.name],
    () =>
      callReadOnlyFunction({
        contractName: contractId.split('.')[1],
        contractAddress: contractId.split('.')[0],
        functionName: fn.name,
        functionArgs: readOnlyValue,
        network: stacksNetwork,
        senderAddress: stxAddress,
      }),
    {
      suspense: false,
      staleTime: 0,
      cacheTime: 0,
    }
  );

  if (!data) return null;

  return (
    <Box p="16px">
      {data.okay ? (
        <Section title="Response">
          <CodeEditor code={parseReadOnlyResponse(data)} />
        </Section>
      ) : (
        <Box>{data.result}</Box>
      )}
      <Flex alignItems="center" justifyContent="center" pt="16px">
        {cancelButton}
      </Flex>
    </Box>
  );
};
