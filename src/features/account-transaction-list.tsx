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
import { MempoolTxsList, TxsListWithTransfers } from '@modules/TransactionList/components/TxsList';

// TODO to move to a separate file
export const Wrapper: React.FC = ({ children }) => (
  <Section title="Transactions">{children}</Section>
);

const EmptyState: React.FC = () => (
  <Stack px="loose" spacing="base" justifyContent="center" alignItems="center" minHeight="300px">
    <NoActivityIllustration width="172px" />
    <Caption>No activity yet</Caption>
  </Stack>
);

export const AccountTransactionList: React.FC<{ contractId: string }> = ({ contractId }) => {
  const queries = useTransactionQueries();
  const transactionsWithTransfersQueryResponse = useInfiniteQuery(
    transactionQK(TransactionQueryKeys.transactionsWithTransfersForAddressInfinite, contractId),
    ({ pageParam }) =>
      queries.fetchTransactionsWithTransfersForAddress(contractId, undefined, pageParam || 0)(),
    { getNextPageParam, enabled: !!contractId, refetchOnWindowFocus: true }
  );
  const mempoolTransactionsQueryResponse = useInfiniteQuery(
    transactionQK(TransactionQueryKeys.mempoolTransactionsForAddressInfinite, contractId),
    ({ pageParam }) =>
      queries.fetchMempoolTransactionsForAddress(contractId, undefined, pageParam || 0)(),
    { getNextPageParam, enabled: !!contractId, refetchOnWindowFocus: true }
  );
  const isLoading =
    transactionsWithTransfersQueryResponse.isLoading || mempoolTransactionsQueryResponse.isLoading;

  const hasPending = !!mempoolTransactionsQueryResponse?.data?.pages?.[0]?.results?.length;
  const hasConfirmed = !!transactionsWithTransfersQueryResponse?.data?.pages?.[0]?.total;
  const hasTransactions = hasPending || hasConfirmed;

  if (isLoading) {
    return <SkeletonAccountTransactionList />;
  }

  return (
    <Wrapper>
      {hasTransactions ? (
        <Box px="loose" data-test="account-transaction-list">
          {!!mempoolTransactionsQueryResponse.data && (
            <MempoolTxsList response={mempoolTransactionsQueryResponse} />
          )}
          {!!transactionsWithTransfersQueryResponse.data && (
            <TxsListWithTransfers
              address={contractId}
              response={transactionsWithTransfersQueryResponse}
              showFooter
              infinite
            />
          )}
        </Box>
      ) : (
        <EmptyState />
      )}
    </Wrapper>
  );
};
