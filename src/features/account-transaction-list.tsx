import { Box } from '@stacks/ui';
import { InfiniteTransactionsList } from '@components/infinite-item-list';
import { Section } from '@components/section';
import * as React from 'react';
import { useAccountInViewTransactions } from '../hooks/currently-in-view-hooks';

export function AccountTransactionList({ limit }: { limit?: number }) {
  const [transactions, { hasNextPage, fetchNextPage, isFetchingNextPage }] =
    useAccountInViewTransactions(limit);
  return (
    <Section title="Transactions">
      <Box px="loose">
        <InfiniteTransactionsList
          data={transactions}
          isFetchingNextPage={isFetchingNextPage}
          fetchNextPage={fetchNextPage}
          hasNextPage={hasNextPage}
          showLoadMoreButton
        />
      </Box>
    </Section>
  );
}
