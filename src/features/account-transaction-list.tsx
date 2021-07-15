import { Box } from '@stacks/ui';
import { InfiniteTransactionsList } from '@components/infinite-item-list';
import { Section } from '@components/section';
import * as React from 'react';
import {
  useAccountInViewPendingTransactions,
  useAccountInViewTransactions,
} from '../hooks/currently-in-view-hooks';

const ConfirmedTransactionsList = () => {
  const [transactions, { hasNextPage, fetchNextPage, isFetchingNextPage }] =
    useAccountInViewTransactions();
  if (!transactions) return null;
  return (
    <InfiniteTransactionsList
      data={transactions}
      isFetchingNextPage={isFetchingNextPage}
      fetchNextPage={fetchNextPage}
      hasNextPage={hasNextPage}
      showLoadMoreButton
    />
  );
};

const MempoolTransactionsList = () => {
  const [transactions, { hasNextPage, fetchNextPage, isFetchingNextPage }] =
    useAccountInViewPendingTransactions();
  if (!transactions) return null;
  return (
    <InfiniteTransactionsList
      data={transactions}
      isFetchingNextPage={isFetchingNextPage}
      fetchNextPage={fetchNextPage}
      hasNextPage={hasNextPage}
      showLoadMoreButton
      borderOnLast
    />
  );
};

export function AccountTransactionList() {
  return (
    <Section title="Transactions">
      <Box px="loose">
        <MempoolTransactionsList />
        <ConfirmedTransactionsList />
      </Box>
    </Section>
  );
}
