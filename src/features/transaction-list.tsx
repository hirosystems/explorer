import { useMemo } from 'react';
import { TransactionListItem } from '@components/transaction-list-item';
import * as React from 'react';
import type {
  MempoolTransactionsListResponse,
  TransactionsListResponse,
} from '@store/transactions';
import type { MempoolTransaction, Transaction } from '@stacks/stacks-blockchain-api-types';

interface TransactionListProps {
  isLastPage?: boolean;
  data?: TransactionsListResponse | MempoolTransactionsListResponse;
  borderOnLast?: boolean;
}

function getUniqueListBy<T>(arr: T[], key: keyof T): T[] {
  return [...new Map(arr.map(item => [item[key], item])).values()] as unknown as T[];
}

export const TransactionList = (props: TransactionListProps) => {
  const { data, isLastPage, borderOnLast } = props;
  const list = useMemo(
    () =>
      data?.results
        ? getUniqueListBy<Transaction | MempoolTransaction>(data?.results, 'tx_id')
        : undefined,
    [data]
  );
  if (!list) return null;
  return (
    <>
      {list?.map((item: Transaction | MempoolTransaction, itemIndex: number) => (
        <TransactionListItem
          tx={item}
          key={item.tx_id}
          isLast={isLastPage && itemIndex + 1 === list.length}
          borderOnLast={borderOnLast}
        />
      ))}
    </>
  );
};
