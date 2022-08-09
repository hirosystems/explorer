import { FilterButton } from '@components/filter-button';
import { InfiniteTransactionsList } from '@components/infinite-item-list';
import { Section } from '@components/section';
import { Tabs } from '@components/tabs';
import { useHomeQueries } from '@features/home/useHomeQueries';
import { Flex } from '@stacks/ui';
import { getNextPageParam } from '@store/common';
import * as React from 'react';
import { useInfiniteQuery } from 'react-query';
import { useTabs } from '../hooks/use-tabs';

const TX_TABS = 'tabs/tx-list';

function useTransactionList(limit: number) {
  const queries = useHomeQueries();
  const { data: confirmedTransactions, ...confirmedActions } = useInfiniteQuery(
    ['confirmedTransactions'],
    ({ pageParam }) => queries.fetchConfirmedTransactions(limit, pageParam || 0)(),
    { getNextPageParam }
  );
  const { data: mempoolTransactions, ...mempoolActions } = useInfiniteQuery(
    ['mempoolTransactions'],
    ({ pageParam }) => queries.fetchMempoolTransactions(limit, pageParam || 0)(),
    { getNextPageParam }
  );
  return { confirmedTransactions, confirmedActions, mempoolTransactions, mempoolActions };
}

const InnerTransactionListContent = ({
  limit,
  infinite,
}: {
  limit: number;
  infinite?: boolean;
}) => {
  const { currentIndex } = useTabs(TX_TABS);
  const mempoolSelected = currentIndex !== 0;
  const { confirmedTransactions, confirmedActions, mempoolTransactions, mempoolActions } =
    useTransactionList(limit);
  const data = mempoolSelected ? mempoolTransactions : confirmedTransactions;
  const { isFetchingNextPage, hasNextPage, fetchNextPage } = mempoolSelected
    ? mempoolActions
    : confirmedActions;

  if (!data) return null;

  return (
    <Flex flexGrow={1} flexDirection="column" px="base-loose">
      <InfiniteTransactionsList
        data={data}
        showLoadMoreButton={infinite}
        isFetchingNextPage={isFetchingNextPage}
        fetchNextPage={fetchNextPage}
        hasNextPage={!!hasNextPage}
        mempoolSelected={mempoolSelected}
      />
    </Flex>
  );
};

export const TabbedTransactionList: React.FC<{
  limit: number;
  infinite?: boolean;
}> = ({ limit, infinite }) => {
  const { currentIndex } = useTabs(TX_TABS);
  const mempoolSelected = currentIndex !== 0;

  return (
    <Section
      title={() => <Tabs tabs={['confirmed', 'pending']} stateKey={TX_TABS} />}
      headerProps={{
        pl: '0',
      }}
      alignSelf="flex-start"
      topRight={!mempoolSelected && FilterButton}
    >
      <InnerTransactionListContent infinite={infinite} limit={limit} />
    </Section>
  );
};
