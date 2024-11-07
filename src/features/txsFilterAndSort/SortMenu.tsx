import { SortDescending } from '@phosphor-icons/react';
import { useCallback, useMemo } from 'react';

import { operations } from '@stacks/blockchain-api-client/lib/generated/schema';

import { FilterMenu } from '../../common/components/FilterMenu';
import { useFilterAndSortState } from './useFilterAndSortState';

type MempoolQuery = NonNullable<operations['get_mempool_transaction_list']['parameters']['query']>;
type MempoolOrderBy = Exclude<MempoolQuery['order_by'], undefined>;
type MempoolOrder = Exclude<MempoolQuery['order'], undefined>;
const MempoolOrderByVals: MempoolOrderBy[] = ['age', 'size', 'fee'];
const MempoolOrderVals: MempoolOrder[] = ['asc', 'desc'];

type TxsQuery = NonNullable<operations['get_transaction_list']['parameters']['query']>;
type txSortBy = Exclude<TxsQuery['sort_by'], undefined>;
type txOrder = Exclude<TxsQuery['order'], undefined>;
const txSortByVals: txSortBy[] = ['block_height', 'fee', 'burn_block_time'];
const txOrderVals: txOrder[] = ['asc', 'desc'];

export function getMempoolTxsSortOptionLabel(sort: MempoolOrderBy, order: MempoolOrder) {
  switch (sort) {
    case 'age':
      return order === 'asc' ? 'Oldest first' : 'Newest first';
    case 'size':
      return order === 'asc' ? 'Smallest size first' : 'Biggest size first';
    case 'fee':
      return order === 'asc' ? 'Lowest fee first' : 'Highest fee first';
  }
}

function getConfirmedTxsSortOptionLabel(sort: string, order: 'asc' | 'desc' | undefined) {
  switch (sort) {
    case 'block_height':
      return order === 'asc' ? 'Lowest block height first' : 'Highest block height first';
    case 'fee':
      return order === 'asc' ? 'Lowest transaction fee first' : 'Highest transaction fee first';
    case 'burn_block_time':
      return order === 'asc' ? 'Oldest first' : 'Newest first';
    default:
      return '';
  }
}

export function MempoolTxsSortMenu() {
  const {
    setMempoolTxsActiveSort,
    setMempoolTxsActiveOrder,
    activeMempoolTxsSort,
    activeMempoolTxsOrder,
  } = useFilterAndSortState();

  const filterLabel = useCallback(
    () => getMempoolTxsSortOptionLabel(activeMempoolTxsSort, activeMempoolTxsOrder),
    [activeMempoolTxsSort, activeMempoolTxsOrder]
  );

  const menuItems = useMemo(
    () =>
      MempoolOrderByVals.flatMap(sort =>
        MempoolOrderVals.reverse().map(order => ({
          onClick: () => {
            setMempoolTxsActiveSort(sort);
            setMempoolTxsActiveOrder(order);
          },
          label: getMempoolTxsSortOptionLabel(sort, order),
        }))
      ),
    [setMempoolTxsActiveSort, setMempoolTxsActiveOrder]
  );

  return (
    <FilterMenu filterLabel={filterLabel} menuItems={menuItems} leftIcon={<SortDescending />} />
  );
}

export function ConfirmedTxsSortMenu() {
  const {
    setConfirmedTxsActiveSort,
    setConfirmedTxsActiveOrder,
    activeConfirmedTxsSort,
    activeConfirmedTxsOrder,
  } = useFilterAndSortState();

  const filterLabel = useCallback(
    () => getConfirmedTxsSortOptionLabel(activeConfirmedTxsSort, activeConfirmedTxsOrder),
    [activeConfirmedTxsSort, activeConfirmedTxsOrder]
  );

  const menuItems = useMemo(
    () =>
      txSortByVals.flatMap(sort =>
        txOrderVals.reverse().map(order => ({
          onClick: () => {
            setConfirmedTxsActiveSort(sort);
            setConfirmedTxsActiveOrder(order);
          },
          label: getConfirmedTxsSortOptionLabel(sort, order),
        }))
      ),
    [setConfirmedTxsActiveSort, setConfirmedTxsActiveOrder]
  );

  return (
    <FilterMenu filterLabel={filterLabel} menuItems={menuItems} leftIcon={<SortDescending />} />
  );
}
