import * as React from 'react';
import { FC, memo, useMemo } from 'react';

import { AddressTransactionWithTransfers } from '@stacks/stacks-blockchain-api-types';

import { Accordion } from '../../../../ui/Accordion';
import { Box } from '../../../../ui/Box';
import { useSuspenseInfiniteQueryResult } from '../../../hooks/useInfiniteQueryResult';
import { useSuspenseAddressConfirmedTxsWithTransfersInfinite } from '../../../queries/useAddressConfirmedTxsWithTransfersInfinite';
import { SectionFooterActions } from '../../SectionFooterActions';
import { SkeletonGenericTransactionList } from '../../loaders/skeleton-transaction';
import { FilteredTxs } from '../common/components/FilteredTxs';
import { TxWithTransferListItem } from '../list-items/TxWithTransferListItem';

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
    <Box position={'relative'} px={'20px'}>
      <Accordion allowMultiple defaultIndex={indexes}>
        <FilteredTxs txs={txsWithTransfers} TxListItem={TxWithTransferListItem} address={address} />
      </Accordion>
      <SectionFooterActions
        label="transactions"
        isLoading={response.isFetchingNextPage}
        fetchNextPage={response.fetchNextPage}
        hasNextPage={response.hasNextPage}
      />
    </Box>
  );
});
