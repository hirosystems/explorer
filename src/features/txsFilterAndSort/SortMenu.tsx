import { SortDescending } from '@phosphor-icons/react';
import { useCallback, useMemo } from 'react';

import {
  GetMempoolTransactionListOrderByEnum,
  GetMempoolTransactionListOrderEnum,
  GetTransactionListOrderEnum,
  GetTransactionListSortByEnum,
} from '@stacks/blockchain-api-client';

import { FilterMenu } from '../../common/components/FilterMenu';
import { useFilterAndSortState } from './useFilterAndSortState';

function getMempoolTxsSortOptionLabel(
  sort: GetMempoolTransactionListOrderByEnum,
  order: GetMempoolTransactionListOrderEnum
) {
  switch (sort) {
    case GetMempoolTransactionListOrderByEnum.age:
      return order === GetMempoolTransactionListOrderEnum.asc ? 'Oldest first' : 'Newest first';
    case GetMempoolTransactionListOrderByEnum.size:
      return order === GetMempoolTransactionListOrderEnum.asc
        ? 'Smallest size first'
        : 'Biggest size first';
    case GetMempoolTransactionListOrderByEnum.fee:
      return order === GetMempoolTransactionListOrderEnum.asc
        ? 'Lowest fee first'
        : 'Highest fee first';
  }
}

function getConfirmedTxsSortOptionLabel(
  sort: GetTransactionListSortByEnum,
  order: GetTransactionListOrderEnum
) {
  switch (sort) {
    case GetTransactionListSortByEnum.block_height:
      return order === GetTransactionListOrderEnum.asc
        ? 'Lowest block height first'
        : 'Highest block height first';
    case GetTransactionListSortByEnum.fee:
      return order === GetTransactionListOrderEnum.asc
        ? 'Lowest transaction fee first'
        : 'Highest transaction fee first';
    case GetTransactionListSortByEnum.burn_block_time:
      return order === GetTransactionListOrderEnum.asc ? 'Oldest first' : 'Newest first';
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
      Object.keys(GetMempoolTransactionListOrderByEnum).flatMap(sort =>
        Object.keys(GetMempoolTransactionListOrderEnum)
          .reverse()
          .map(order => ({
            onClick: () => {
              setMempoolTxsActiveSort(sort as GetMempoolTransactionListOrderByEnum);
              setMempoolTxsActiveOrder(order as GetMempoolTransactionListOrderEnum);
            },
            label: getMempoolTxsSortOptionLabel(
              sort as GetMempoolTransactionListOrderByEnum,
              order as GetMempoolTransactionListOrderEnum
            ),
          }))
      ),
    [setMempoolTxsActiveSort, setMempoolTxsActiveOrder]
  );

  return <FilterMenu filterLabel={filterLabel} menuItems={menuItems} leftIcon={SortDescending} />;
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
      Object.keys(GetTransactionListSortByEnum).flatMap(sort =>
        Object.keys(GetTransactionListOrderEnum)
          .reverse()
          .map(order => ({
            onClick: () => {
              setConfirmedTxsActiveSort(sort as GetTransactionListSortByEnum);
              setConfirmedTxsActiveOrder(order as GetTransactionListOrderEnum);
            },
            label: getConfirmedTxsSortOptionLabel(
              sort as GetTransactionListSortByEnum,
              order as GetTransactionListOrderEnum
            ),
          }))
      ),
    [setConfirmedTxsActiveSort, setConfirmedTxsActiveOrder]
  );

  return <FilterMenu filterLabel={filterLabel} menuItems={menuItems} leftIcon={SortDescending} />;
}
