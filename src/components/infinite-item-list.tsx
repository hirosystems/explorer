import { SectionFooterAction } from '@components/section-footer-button';
import { TransactionList } from '@features/transaction-list';
import { Box } from '@stacks/ui';
import type { InfiniteData } from 'react-query';
import * as React from 'react';

import type {
  MempoolTransactionsListResponse,
  TransactionsListResponse,
} from '@store/transactions';

export function InfiniteTransactionsList({
  data,
  isFetchingNextPage,
  fetchNextPage,
  hasNextPage,
  showLoadMoreButton,
  mempoolSelected,
}: {
  data: InfiniteData<TransactionsListResponse> | InfiniteData<MempoolTransactionsListResponse>;
  isFetchingNextPage: boolean;
  fetchNextPage: () => void;
  hasNextPage: boolean;
  showLoadMoreButton?: boolean;
  mempoolSelected?: boolean;
}) {
  if (!data.pages) return null;
  return (
    <>
      <Box position="relative">
        {data.pages.map((page, index, arr) => (
          <TransactionList
            data={page}
            isLastPage={index === arr.length - 1}
            data-test={`tx-list-page-${index}`}
            key={`tx-list-page-${index}`}
            mempoolSelected={mempoolSelected}
          />
        ))}
      </Box>
      <SectionFooterAction
        path="transactions"
        isLoading={isFetchingNextPage}
        onClick={fetchNextPage}
        showLoadMoreButton={showLoadMoreButton}
        hasNextPage={hasNextPage}
      />
    </>
  );
}
