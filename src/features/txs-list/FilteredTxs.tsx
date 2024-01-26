import { FC, useMemo } from 'react';

import {
  AddressTransactionWithTransfers,
  MempoolTransaction,
  Transaction,
} from '@stacks/stacks-blockchain-api-types';

import {
  AllTransactionsFilteredMessage,
  NoTransactionsMessage,
} from '../txsFilterAndSort/TransactionMessages';
import { useFilterAndSortState } from '../txsFilterAndSort/useFilterAndSortState';

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
  const { activeFilters } = useFilterAndSortState();
  const filteredTxs: T[] = useMemo(
    () =>
      !activeFilters.length ? txs : txs?.filter(tx => activeFilters.includes(getTx(tx).tx_type)),
    [txs, activeFilters]
  );

  const hasTxs = !!txs?.length;
  const hasVisibleTxs = !!filteredTxs?.length;
  const allTxsAreFilteredOut = hasTxs && !hasVisibleTxs;
  if (allTxsAreFilteredOut) return <AllTransactionsFilteredMessage />;
  if (hasVisibleTxs)
    return (
      <>
        {filteredTxs?.map(tx => (
          <TxListItem tx={tx} address={address} key={`tx-list-item-${getTx(tx).tx_id}`} />
        ))}
      </>
    );
  return <NoTransactionsMessage />;
};
