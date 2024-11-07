import { Box } from '@chakra-ui/react';
import { FC, memo } from 'react';

import { MempoolTransaction } from '@stacks/stacks-blockchain-api-types';

import { ListFooter } from '../../common/components/ListFooter';
import { SkeletonGenericTransactionList } from '../../common/components/loaders/skeleton-transaction';
import { useInfiniteQueryResult } from '../../common/hooks/useInfiniteQueryResult';
import { useAddressMempoolTxsInfinite } from '../../common/queries/useAddressMempoolTxsInfinite';
import { FilteredTxs } from './FilteredTxs';
import { MempoolTxListItem } from './ListItem/MempoolTxListItem';

export const AddressMempoolTxsList: FC<{ address: string }> = memo(({ address }) => {
  const response = useAddressMempoolTxsInfinite(address);

  const txs = useInfiniteQueryResult<MempoolTransaction>(response);

  if (response.isLoading) {
    return <SkeletonGenericTransactionList />;
  }

  return (
    <Box px={5}>
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
