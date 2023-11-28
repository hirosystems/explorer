import { FC, useMemo } from 'react';
import * as React from 'react';

import {
  AddressTransactionWithTransfers,
  MempoolTransaction,
  Transaction,
} from '@stacks/stacks-blockchain-api-types';

import { FilteredMessage } from '../../../../../features/txs-filter/FilterPanel';
import { useFilterState } from '../../../../../features/txs-filter/useFilterState';
import { Grid } from '../../../../../ui/Grid';
import { Text } from '../../../../../ui/Text';

interface FilteredTxsProps<T extends unknown> {
  txs: T[];
  TxListItem: FC<{ tx: T; address?: string }>;
  address?: string;
}

type PossibleTxTypes = Transaction | MempoolTransaction | AddressTransactionWithTransfers;

const getTx = (tx: PossibleTxTypes) => ('tx' in tx ? tx.tx : tx);

export const FilteredTxs = <T extends PossibleTxTypes>({
  txs,
  TxListItem,
  address,
}: FilteredTxsProps<T>) => {
  const { activeFilters } = useFilterState();
  const filteredTxs: T[] = useMemo(
    () => txs?.filter(tx => activeFilters[getTx(tx).tx_type]),
    [txs, activeFilters]
  );
  const hasTxs = !!txs?.length;
  const hasVisibleTxs = !!filteredTxs?.length;
  const allTxsAreFilteredOut = hasTxs && !hasVisibleTxs;
  if (allTxsAreFilteredOut) return <FilteredMessage />;
  if (hasVisibleTxs)
    return (
      <>
        {filteredTxs?.map(tx => (
          <TxListItem tx={tx} address={address} key={`tx-list-item-${getTx(tx).tx_id}`} />
        ))}
      </>
    );
  return (
    <Grid placeItems="center" px="16px" py="32px">
      <Text color={'textCaption'} mt="32px">
        No transactions
      </Text>
    </Grid>
  );
};
