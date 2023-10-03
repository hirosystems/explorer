import { memo } from 'react';
import { Transaction } from '@stacks/stacks-blockchain-api-types';
import { useApi } from '@/common/api/client';
import { SkeletonGenericTransactionList } from '@/components/loaders/skeleton-transaction';
import { SectionFooterAction } from '@/components/section-footer-button';
import { Box } from '@/ui/components';

import { FilteredTxs } from '../../../common/components/tx-lists/common/components/FilteredTxs';
import { TxListItem } from '../../../common/components/tx-lists/list-items/TxListItem';
import { useInfiniteQueryResult } from '../../../common/hooks/useInfiniteQueryResult';
import { useBlockTxsInfinite } from '../../../common/queries/useBlockTxsInfinite';

interface BlockTxsListProps {
  blockHash: string;
  limit?: number;
}

export const BlockTxsList = memo(({ blockHash, limit }: BlockTxsListProps) => {
  const api = useApi();
  const response = useBlockTxsInfinite(api, { blockHash });

  const txs = useInfiniteQueryResult<Transaction>(response, limit);

  if (response.isLoading) {
    return <SkeletonGenericTransactionList />;
  }

  return (
    <Box position="relative" px="20px">
      <FilteredTxs txs={txs} TxListItem={TxListItem} />
      <SectionFooterAction
        isLoading={response.isFetchingNextPage}
        hasNextPage={response.hasNextPage}
        fetchNextPage={limit ? undefined : response.fetchNextPage}
        label="transactions"
      />
    </Box>
  );
});
