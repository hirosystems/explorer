import * as React from 'react';
import { Box } from '@stacks/ui';
import { TransactionList } from '@features/transaction-list';
import { SectionFooterAction } from '@components/section-footer-button';
import type { InfiniteData } from 'react-query';

import type {
  TransactionsListResponse,
  MempoolTransactionsListResponse,
} from '@store/transactions';

export function InfiniteTransactionsList({
  data,
  isFetchingNextPage,
  fetchNextPage,
  hasNextPage,
  showLoadMoreButton,
  borderOnLast,
}: {
  data: InfiniteData<TransactionsListResponse> | InfiniteData<MempoolTransactionsListResponse>;
  isFetchingNextPage: boolean;
  fetchNextPage: () => void;
  hasNextPage: boolean;
  showLoadMoreButton?: boolean;
  borderOnLast?: boolean;
}) {
  return (
    <>
      <Box position="relative">
        {data.pages.map((page, index, arr) => (
          <TransactionList
            data={page}
            isLastPage={index === arr.length - 1}
            key={`tx-list-page-${index}`}
            borderOnLast={borderOnLast}
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
