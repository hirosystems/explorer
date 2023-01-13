import { useApi } from '@/common/api/client';
import { SkeletonGenericTransactionList } from '@/components/loaders/skeleton-transaction';
import { SectionFooterAction } from '@/components/section-footer-button';
import { Box } from '@/ui/Box';
import { Accordion } from '@/ui/components';
import * as React from 'react';
import { FC, memo } from 'react';

import { AddressTransactionWithTransfers } from '@stacks/stacks-blockchain-api-types';

import { useInfiniteQueryResult } from '../../../hooks/useInfiniteQueryResult';
import { useAddressConfirmedTxsWithTransfersInfinite } from '../../../queries/useAddressConfirmedTxsWithTransfersInfinite';
import { FilteredTxs } from '../common/components/FilteredTxs';
import { TxWithTransferListItem } from '../list-items/TxWithTransferListItem';

export const AddressConfirmedTxsList: FC<{ address: string }> = memo(({ address }) => {
  const api = useApi();
  const response = useAddressConfirmedTxsWithTransfersInfinite(api, { address });

  const txsWithTransfers = useInfiniteQueryResult<AddressTransactionWithTransfers>(response);

  if (response.isLoading) {
    return <SkeletonGenericTransactionList />;
  }

  return (
    <Box position={'relative'} px={'20px'}>
      <Accordion allowMultiple>
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
