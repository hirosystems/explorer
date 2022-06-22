import * as React from 'react';
import { useMemo } from 'react';
import { TransactionListItem } from '@components/transaction-list-item';
import type {
  MempoolTransactionsListResponse,
  TransactionsListResponse,
} from '@store/transactions';
import type { MempoolTransaction, Transaction } from '@stacks/stacks-blockchain-api-types';
import { useFilterState } from '@common/hooks/use-filter-state';
import { TxFilterTypes } from '@features/transactions-filter/transactions-filter-slice';

interface TransactionListProps {
  isLastPage?: boolean;
  data?: TransactionsListResponse | MempoolTransactionsListResponse;
}

function getUniqueListBy<T>(arr: T[], key: keyof T): T[] {
  return [...new Map(arr.map(item => [item[key], item])).values()] as unknown as T[];
}

export const TransactionList = (props: TransactionListProps) => {
  const { data, isLastPage } = props;
  const list = useMemo(
    () =>
      data?.results
        ? getUniqueListBy<Transaction | MempoolTransaction>(data?.results, 'tx_id')
        : undefined,
    [data]
  );
  if (!list) return null;
  const { activeFilters } = useFilterState(TxFilterTypes.TransactionsPageTxFilter);
  const filteredTxs = list.filter(tx => activeFilters[tx.tx_type]);
  return (
    <>
      {filteredTxs?.map((tx: Transaction | MempoolTransaction, itemIndex: number) => (
        <TransactionListItem
          tx={tx}
          key={tx.tx_id}
          data-test="transaction-list-item"
          isLast={isLastPage && itemIndex + 1 === list.length}
        />
      ))}
    </>
  );
};
