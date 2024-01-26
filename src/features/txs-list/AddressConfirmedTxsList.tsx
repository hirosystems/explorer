import { FC, memo, useMemo } from 'react';

import { AddressTransactionWithTransfers } from '@stacks/stacks-blockchain-api-types';

import { ListFooter } from '../../common/components/ListFooter';
import { SkeletonGenericTransactionList } from '../../common/components/loaders/skeleton-transaction';
import { useSuspenseInfiniteQueryResult } from '../../common/hooks/useInfiniteQueryResult';
import { useSuspenseAddressConfirmedTxsWithTransfersInfinite } from '../../common/queries/useAddressConfirmedTxsWithTransfersInfinite';
import { Accordion } from '../../ui/Accordion';
import { FilteredTxs } from './FilteredTxs';
import { TxWithTransferListItem } from './ListItem/TxWithTransferListItem';

export const AddressConfirmedTxsList: FC<{ address: string }> = memo(({ address }) => {
  const response = useSuspenseAddressConfirmedTxsWithTransfersInfinite(address);

  const txsWithTransfers =
    useSuspenseInfiniteQueryResult<AddressTransactionWithTransfers>(response);

  const indexes = useMemo(
    () =>
      txsWithTransfers
        .map((txWithTransfers, i) =>
          !!txWithTransfers.stx_transfers?.length ||
          !!txWithTransfers.ft_transfers?.length ||
          !!txWithTransfers.nft_transfers?.length
            ? i
            : undefined
        )
        .filter(function isDefined<TValue>(value: TValue | undefined): value is TValue {
          return value !== undefined;
        }),
    [txsWithTransfers]
  );

  if (response.isLoading) {
    return <SkeletonGenericTransactionList />;
  }

  return (
    <>
      <Accordion allowMultiple defaultIndex={indexes}>
        <FilteredTxs txs={txsWithTransfers} TxListItem={TxWithTransferListItem} address={address} />
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
