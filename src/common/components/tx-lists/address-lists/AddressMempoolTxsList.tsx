import * as React from 'react';
import { FC, memo } from 'react';

import { MempoolTransaction } from '@stacks/stacks-blockchain-api-types';

import { Box } from '../../../../ui/Box';
import { useSuspenseInfiniteQueryResult } from '../../../hooks/useInfiniteQueryResult';
import { useSuspenseAddressMempoolTxsInfinite } from '../../../queries/useAddressMempoolTxsInfinite';
import { SectionFooterActions } from '../../SectionFooterActions';
import { SkeletonGenericTransactionList } from '../../loaders/skeleton-transaction';
import { FilteredTxs } from '../common/components/FilteredTxs';
import { MempoolTxListItem } from '../list-items/MempoolTxListItem';

export const AddressMempoolTxsList: FC<{ address: string }> = memo(({ address }) => {
  const response = useSuspenseAddressMempoolTxsInfinite(address);

  const txs = useSuspenseInfiniteQueryResult<MempoolTransaction>(response);

  if (response.isLoading) {
    return <SkeletonGenericTransactionList />;
  }

  return (
    <Box px={'20px'}>
      <FilteredTxs txs={txs} TxListItem={MempoolTxListItem} />
      <SectionFooterActions
        label="transactions"
        isLoading={response.isFetchingNextPage}
        fetchNextPage={response.fetchNextPage}
        hasNextPage={response.hasNextPage}
      />
    </Box>
  );
});
