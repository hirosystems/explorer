import * as React from 'react';
import { FC, memo } from 'react';

import { MempoolTransaction } from '@stacks/stacks-blockchain-api-types';

import { ListFooter } from '../../common/components/ListFooter';
import { SkeletonGenericTransactionList } from '../../common/components/loaders/skeleton-transaction';
import { useSuspenseInfiniteQueryResult } from '../../common/hooks/useInfiniteQueryResult';
import { useSuspenseAddressMempoolTxsInfinite } from '../../common/queries/useAddressMempoolTxsInfinite';
import { Box } from '../../ui/Box';
import { FilteredTxs } from './FilteredTxs';
import { MempoolTxListItem } from './ListItem/MempoolTxListItem';

export const AddressMempoolTxsList: FC<{ address: string }> = memo(({ address }) => {
  const response = useSuspenseAddressMempoolTxsInfinite(address);

  const txs = useSuspenseInfiniteQueryResult<MempoolTransaction>(response);

  if (response.isLoading) {
    return <SkeletonGenericTransactionList />;
  }

  return (
    <Box px={'20px'}>
      <FilteredTxs txs={txs} TxListItem={MempoolTxListItem} />
      <ListFooter
        label="transactions"
        isLoading={response.isFetchingNextPage}
        fetchNextPage={response.fetchNextPage}
        hasNextPage={response.hasNextPage}
      />
    </Box>
  );
});
