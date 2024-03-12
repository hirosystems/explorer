import { FC, memo } from 'react';

import { AddressTransaction } from '@stacks/stacks-blockchain-api-types';

import { ListFooter } from '../../common/components/ListFooter';
import { SkeletonGenericTransactionList } from '../../common/components/loaders/skeleton-transaction';
import { useSuspenseInfiniteQueryResult } from '../../common/hooks/useInfiniteQueryResult';
import { useSuspenseAddressTransactionInfinite } from '../../common/queries/useAddressConfirmedTxsWithTransfersInfinite';
import { Accordion } from '../../ui/Accordion';
import { FilteredTxs } from './FilteredTxs';
import { TxWithTransferListItem } from './ListItem/TxWithTransferListItem';

export const AddressConfirmedTxsList: FC<{ address: string }> = memo(({ address }) => {
  const response = useSuspenseAddressTransactionInfinite(address);

  const addressTxs = useSuspenseInfiniteQueryResult<AddressTransaction>(response);

  if (response.isLoading) {
    return <SkeletonGenericTransactionList />;
  }

  return (
    <>
      <Accordion allowMultiple>
        <FilteredTxs txs={addressTxs} TxListItem={TxWithTransferListItem} address={address} />
      </Accordion>
      <ListFooter
        label="transactions"
        isLoading={response.isFetchingNextPage}
        fetchNextPage={response.fetchNextPage}
        hasNextPage={response.hasNextPage}
      />
    </>
  );
});
