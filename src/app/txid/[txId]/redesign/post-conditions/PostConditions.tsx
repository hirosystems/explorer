'use client';

import { Stack } from '@chakra-ui/react';

import {
  ContractCallTransaction,
  MempoolContractCallTransaction,
} from '@stacks/stacks-blockchain-api-types';

import { TabsContentContainer } from '../TxTabs';
import { PostConditionsHeader } from './PostConditionsHeader';
import { PostConditionsTable } from './PostConditionsTable';

export function PostConditions({
  tx,
}: {
  tx: ContractCallTransaction | MempoolContractCallTransaction;
}) {
  const { post_condition_mode: mode } = tx;
  return (
    <Stack gap={1}>
      <TabsContentContainer>
        <PostConditionsHeader postConditionMode={mode} />
      </TabsContentContainer>
      <TabsContentContainer>
        <PostConditionsTable tx={tx} />
      </TabsContentContainer>
    </Stack>
  );
}
