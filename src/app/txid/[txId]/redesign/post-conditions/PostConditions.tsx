'use client';

import { SectionTabsContentContainer } from '@/common/components/SectionTabs';
import { TxDetailsOf } from '@/common/types/tx-v3';
import { Stack } from '@chakra-ui/react';

import { PostConditionsHeader } from './PostConditionsHeader';
import { PostConditionsTable } from './PostConditionsTable';

export function PostConditions({
  tx,
}: {
  tx: TxDetailsOf<'contract_call'> | TxDetailsOf<'smart_contract'>;
}) {
  const { post_condition_mode: mode } = tx;
  return (
    <Stack gap={1}>
      {mode && (
        <SectionTabsContentContainer>
          <PostConditionsHeader postConditionMode={mode} />
        </SectionTabsContentContainer>
      )}
      <SectionTabsContentContainer>
        <PostConditionsTable tx={tx} />
      </SectionTabsContentContainer>
    </Stack>
  );
}
