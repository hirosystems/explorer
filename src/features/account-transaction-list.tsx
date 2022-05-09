import { Box, Stack } from '@stacks/ui';
import { InfiniteTransactionsList } from '@components/infinite-item-list';
import { Section } from '@components/section';
import * as React from 'react';
import { NoActivityIllustration } from '@components/no-activity-illustration';
import { Caption } from '@components/typography';
import { useInfiniteQuery } from 'react-query';
import { getNextPageParam } from '@store/common';
import { useTransactionQueries } from '@features/transaction/use-transaction-queries';
import { transactionQK, TransactionQueryKeys } from '@features/transaction/query-keys';

const Wrapper: React.FC = ({ children }) => <Section title="Transactions">{children}</Section>;

const EmptyState: React.FC = () => (
  <Stack px="loose" spacing="base" justifyContent="center" alignItems="center" minHeight="300px">
    <NoActivityIllustration width="172px" />
    <Caption>No activity yet</Caption>
  </Stack>
);

export const AccountTransactionList: React.FC<{ contractId?: string }> = ({ contractId }) => {
  if (!contractId) {
    return (
      <Wrapper>
        <EmptyState />
      </Wrapper>
    );
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

  const hasPending = !!mempoolTransactionsQueryResponse?.data?.pages?.[0]?.results?.length;
  const hasConfirmed = !!transactionsQueryResponse?.data?.pages?.[0]?.total;
  const hasTransactions = hasPending || hasConfirmed;

  return (
    <Wrapper>
      {hasTransactions ? (
        <Box px="loose">
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
