import { memo, useMemo } from 'react';
import { AddressTransactionWithTransfers } from '@stacks/stacks-blockchain-api-types';
import { useApi } from '@/common/api/client';
import { SkeletonGenericTransactionList } from '@/components/loaders/skeleton-transaction';
import { SectionFooterAction } from '@/components/section-footer-button';
import { Box } from '@/ui/Box';
import { Accordion } from '@/ui/components';

import { useInfiniteQueryResult } from '../../../hooks/useInfiniteQueryResult';
import { useAddressConfirmedTxsWithTransfersInfinite } from '../../../queries/useAddressConfirmedTxsWithTransfersInfinite';
import { FilteredTxs } from '../common/components/FilteredTxs';
import { TxWithTransferListItem } from '../list-items/TxWithTransferListItem';

export const AddressConfirmedTxsList = memo(({ address }: { address: string }) => {
  const api = useApi();
  const response = useAddressConfirmedTxsWithTransfersInfinite(api, { address });

  const txsWithTransfers = useInfiniteQueryResult<AddressTransactionWithTransfers>(response);

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
    <Box position="relative" px="20px">
      <Accordion allowMultiple defaultIndex={indexes}>
        <FilteredTxs txs={txsWithTransfers} TxListItem={TxWithTransferListItem} address={address} />
      </Accordion>
      <SectionFooterAction
        label="transactions"
        isLoading={response.isFetchingNextPage}
        fetchNextPage={response.fetchNextPage}
        hasNextPage={response.hasNextPage}
      />
    </Box>
  );
});
