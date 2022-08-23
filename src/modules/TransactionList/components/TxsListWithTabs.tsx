import { FilterButton } from '@components/filter-button';
import { Section } from '@components/section';
import { Tabs } from '@modules/TransactionList/components/Tabs';
import { Box, Flex } from '@stacks/ui';
import * as React from 'react';
import { FC, memo, useCallback } from 'react';
import { useTabs } from '../hooks/useTabs';
import { SkeletonGenericTransactionList } from '@components/loaders/skeleton-transaction';
import { MempoolTxsList, TxsList } from './TxsList';
import { useTransactionList } from '../hooks/useTransactionList';

const TX_TABS = 'tabs/tx-list';

export const TxsListWithTabs: React.FC<{
  limit: number;
  infinite?: boolean;
}> = memo(({ limit, infinite }) => {
  console.log('[debug] rendering TxsListWithTabs');
  const { currentIndex } = useTabs(TX_TABS);
  const mempoolSelected = currentIndex !== 0;
  const { confirmedTransactionsResponse, mempoolTransactionsResponse } = useTransactionList(limit);
  const title = useCallback(() => <Tabs tabs={['confirmed', 'pending']} stateKey={TX_TABS} />, []);

  const Wrapper: FC = memo(({ children }) => {
    console.log('[debug] rendering Wrapper');
    return (
      <Section
        title={title}
        headerProps={{ pl: '0' }}
        alignSelf="flex-start"
        topRight={!mempoolSelected && FilterButton}
      >
        <Flex flexGrow={1} flexDirection="column" px="base-loose">
          <Box position="relative">{children}</Box>
        </Flex>
      </Section>
    );
  });

  if (mempoolSelected && mempoolTransactionsResponse.data)
    return (
      <Wrapper>
        <MempoolTxsList
          response={mempoolTransactionsResponse}
          showFooter
          infinite={infinite}
          limit={limit}
        />
      </Wrapper>
    );

  if (!mempoolSelected && confirmedTransactionsResponse.data)
    return (
      <Wrapper>
        <TxsList
          response={confirmedTransactionsResponse}
          showFooter
          infinite={infinite}
          limit={limit}
        />
      </Wrapper>
    );

  return (
    <Wrapper>
      <SkeletonGenericTransactionList />
    </Wrapper>
  );
});
