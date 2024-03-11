import { FC, useMemo } from 'react';

import { AddressTransaction } from '@stacks/blockchain-api-client/src/generated/models';
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
import { TxListItem } from './ListItem/TxListItem';

interface FilteredTxsProps<T extends unknown> {
  txs: T[];
  TxListItem: FC<{ tx: T; address?: string }>;
  address?: string;
}

type PossibleTxTypes =
  | Transaction
  | MempoolTransaction
  | AddressTransactionWithTransfers
  | AddressTransaction;

const getTx = (tx: PossibleTxTypes) => ('tx' in tx ? tx.tx : tx);

export const FilteredTxs = <T extends PossibleTxTypes>({
  txs,
  TxListItem,
  address,
}: FilteredTxsProps<T>) => {
  const { activeFilters } = useFilterAndSortState();
  const filteredTxs: T[] = useMemo(
    () =>
      // TODO: fix type
      // @ts-ignore
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
          // TODO: fix type
          // @ts-ignore
          <TxListItem tx={tx} address={address} key={`tx-list-item-${getTx(tx).tx_id}`} />
        ))}
      </>
    );
  return <NoTransactionsMessage />;
};
