import * as React from 'react';
import { Flex } from '@stacks/ui';
import { Section } from '@components/section';
import { FilterButton } from '@components/filter-button';
import {
  useMempoolTransactionsListState,
  useTransactionsListState,
} from '../hooks/use-transactions-list-state';
import { useTabs } from '../hooks/use-tabs';
import { InfiniteTransactionsList } from '@components/infinite-item-list';
import { Tabs } from '@components/tabs';
import { DEFAULT_TX_FILTER_TYPES, GetTransactionListTypeEnum } from '@store/recoil/filter';
import { useFilterState } from '@common/hooks/use-filter-state';
import { SafeSuspense } from '@components/ssr-safe-suspense';

const TX_TABS = 'tabs/tx-list';

const InnerTransactionListContent = ({
  limit,
  types,
  infinite,
}: {
  limit?: number;
  infinite?: boolean;
  types: GetTransactionListTypeEnum[];
}) => {
  const { currentIndex } = useTabs(TX_TABS);
  const mempoolSelected = currentIndex !== 0;
  const [confirmedPages, confirmedActions] = useTransactionsListState(limit, types);
  const [mempoolPages, mempoolActions] = useMempoolTransactionsListState(limit);
  const data = mempoolSelected ? mempoolPages : confirmedPages;
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
        hasNextPage={hasNextPage}
      />
    </Flex>
  );
};

export const TabbedTransactionList: React.FC<{
  limit?: number;
  infinite?: boolean;
}> = ({ limit, infinite }) => {
  const { types, previousTypes } = useFilterState('txList');
  const { currentIndex } = useTabs(TX_TABS);
  const mempoolSelected = currentIndex !== 0;

  return (
    <Section
      title={() => <Tabs tabs={['confirmed', 'pending']} stateKey={TX_TABS} />}
      headerProps={{
        pl: '0',
      }}
      alignSelf="flex-start"
      topRight={!mempoolSelected && infinite && FilterButton}
    >
      <SafeSuspense
        fallback={
          <InnerTransactionListContent
            infinite={infinite}
            limit={limit}
            types={previousTypes || DEFAULT_TX_FILTER_TYPES}
          />
        }
      >
        <InnerTransactionListContent infinite={infinite} limit={limit} types={types} />
      </SafeSuspense>
    </Section>
  );
};
