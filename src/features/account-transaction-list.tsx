import { InfiniteTransactionsList } from '@components/infinite-item-list';
import { SkeletonAccountTransactionList } from '@components/loaders/skeleton-transaction';
import { NoActivityIllustration } from '@components/no-activity-illustration';
import { Section } from '@components/section';
import { Caption } from '@components/typography';
import { transactionQK, TransactionQueryKeys } from '@features/transaction/query-keys';
import { useTransactionQueries } from '@features/transaction/use-transaction-queries';
import { Box, Stack } from '@stacks/ui';
import { getNextPageParam } from '@store/common';
import * as React from 'react';
import { useInfiniteQuery } from 'react-query';
import { FilterButton } from '@components/filter-button';

// TODO to move to a separate file
export const Wrapper: React.FC = ({ children }) => (
  <Section title="Transactions" topRight={FilterButton}>
    {children}
  </Section>
);

const EmptyState: React.FC = () => (
  <Stack px="loose" spacing="base" justifyContent="center" alignItems="center" minHeight="300px">
    <NoActivityIllustration width="172px" />
    <Caption>No activity yet</Caption>
  </Stack>
);

export const AccountTransactionList: React.FC<{ contractId?: string }> = ({ contractId }) => {
  if (!contractId) {
    return <SkeletonAccountTransactionList />;
  }

  const queries = useTransactionQueries();
  const transactionsQueryResponse = useInfiniteQuery(
    transactionQK(TransactionQueryKeys.transactionsForAddress, contractId),
    ({ pageParam }) => queries.fetchTransactionsForAddress(contractId, undefined, pageParam || 0)(),
    { getNextPageParam }
  );
  const mempoolTransactionsQueryResponse = useInfiniteQuery(
    transactionQK(TransactionQueryKeys.mempoolTransactionsForAddress, contractId),
    ({ pageParam }) =>
      queries.fetchMempoolTransactionsForAddress(contractId, undefined, pageParam || 0)(),
    { getNextPageParam }
  );
  const isLoading =
    transactionsQueryResponse.isLoading || mempoolTransactionsQueryResponse.isLoading;

  const hasPending = !!mempoolTransactionsQueryResponse?.data?.pages?.[0]?.results?.length;
  const hasConfirmed = !!transactionsQueryResponse?.data?.pages?.[0]?.total;
  const hasTransactions = hasPending || hasConfirmed;

  if (isLoading) {
    return <SkeletonAccountTransactionList />;
  }

  return (
    <Wrapper>
      {hasTransactions ? (
        <Box px="loose" data-test="account-transaction-list">
          {!!mempoolTransactionsQueryResponse.data && (
            <InfiniteTransactionsList
              data={mempoolTransactionsQueryResponse.data}
              isFetchingNextPage={mempoolTransactionsQueryResponse.isFetchingNextPage}
              fetchNextPage={mempoolTransactionsQueryResponse.fetchNextPage}
              hasNextPage={!!mempoolTransactionsQueryResponse.hasNextPage}
              showLoadMoreButton
            />
          )}
          {!!transactionsQueryResponse.data && (
            <InfiniteTransactionsList
              data={transactionsQueryResponse.data}
              isFetchingNextPage={transactionsQueryResponse.isFetchingNextPage}
              fetchNextPage={transactionsQueryResponse.fetchNextPage}
              hasNextPage={!!transactionsQueryResponse.hasNextPage}
              showLoadMoreButton
            />
          )}
        </Box>
      ) : (
        <EmptyState />
      )}
    </Wrapper>
  );
};
