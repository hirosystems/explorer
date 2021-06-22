import { Box, Flex, Stack } from '@stacks/ui';
import { InfiniteTransactionsList } from '@components/infinite-item-list';
import { Section } from '@components/section';
import * as React from 'react';
import {
  useAccountInViewPendingTransactions,
  useAccountInViewTransactions,
} from '../hooks/currently-in-view-hooks';
import { NoActivityIllustration } from '@components/no-activity-illustration';
import { Caption } from '@components/typography';

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

const useHasTransactions = () => {
  const [pendingTransactions] = useAccountInViewPendingTransactions();
  const [transactions] = useAccountInViewTransactions();
  const hasPending = pendingTransactions && pendingTransactions?.pages?.[0].results.length > 0;
  const hasConfirmed = transactions && transactions?.pages?.[0].total > 0;
  return hasPending || hasConfirmed;
};

export function AccountTransactionList() {
  const hasTransactions = useHasTransactions();
  return (
    <Section title="Transactions">
      {hasTransactions ? (
        <Box px="loose">
          <MempoolTransactionsList />
          <ConfirmedTransactionsList />
        </Box>
      ) : (
        <Stack
          px="loose"
          spacing="base"
          justifyContent="center"
          alignItems="center"
          minHeight="300px"
        >
          <NoActivityIllustration width="172px" />
          <Caption>No activity yet</Caption>
        </Stack>
      )}
    </Section>
  );
}
