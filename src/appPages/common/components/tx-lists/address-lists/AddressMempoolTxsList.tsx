import { memo } from 'react';
import { MempoolTransaction } from '@stacks/stacks-blockchain-api-types';
import { useApi } from '@/common/api/client';
import { SkeletonGenericTransactionList } from '@/components/loaders/skeleton-transaction';
import { SectionFooterAction } from '@/components/section-footer-button';
import { Box } from '@/ui/Box';

import { useInfiniteQueryResult } from '../../../hooks/useInfiniteQueryResult';
import { useAddressMempoolTxsInfinite } from '../../../queries/useAddressMempoolTxsInfinite';
import { FilteredTxs } from '../common/components/FilteredTxs';
import { MempoolTxListItem } from '../list-items/MempoolTxListItem';

export const AddressMempoolTxsList = memo(({ address }: { address: string }) => {
  const api = useApi();
  const response = useAddressMempoolTxsInfinite(api, {
    address,
  });

  const txs = useInfiniteQueryResult<MempoolTransaction>(response);

  if (response.isLoading) {
    return <SkeletonGenericTransactionList />;
  }

  return (
    <Box px="20px">
      <FilteredTxs txs={txs} TxListItem={MempoolTxListItem} />
      <SectionFooterAction
        label="transactions"
        isLoading={response.isFetchingNextPage}
        fetchNextPage={response.fetchNextPage}
        hasNextPage={response.hasNextPage}
      />
    </Box>
  );
});
