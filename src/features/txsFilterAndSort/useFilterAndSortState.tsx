'use client';

import {
  GetMempoolTransactionListOrderByEnum,
  GetMempoolTransactionListOrderEnum,
  GetTransactionListOrderEnum,
  GetTransactionListSortByEnum,
} from '@stacks/blockchain-api-client';

import { useAppDispatch, useAppSelector } from '../../common/state/hooks';
import { txFilterAndSort } from './txsFilterAndSortSlice';
import { useFilterAndSortScope } from './useFilterAndSortScope';

export const useFilterAndSortState = () => {
  const dispatch = useAppDispatch();
  const filterScope = useFilterAndSortScope();

  const setActiveFilters = (filters: string[]) => {
    dispatch(txFilterAndSort[filterScope].actions.setActiveFilters(filters));
  };

  const setMempoolTxsActiveSort = (sort: GetMempoolTransactionListOrderByEnum) => {
    dispatch(txFilterAndSort[filterScope].actions.setMempoolTxsActiveSort(sort));
  };

  const setMempoolTxsActiveOrder = (order: GetMempoolTransactionListOrderEnum) => {
    dispatch(txFilterAndSort[filterScope].actions.setMempoolTxsActiveOrder(order));
  };

  const setConfirmedTxsActiveSort = (sort: GetTransactionListSortByEnum) => {
    dispatch(txFilterAndSort[filterScope].actions.setConfirmedTxsActiveSort(sort));
  };

  const setConfirmedTxsActiveOrder = (order: GetTransactionListOrderEnum) => {
    dispatch(txFilterAndSort[filterScope].actions.setConfirmedTxsActiveOrder(order));
  };

  return {
    setActiveFilters,
    setMempoolTxsActiveSort,
    setMempoolTxsActiveOrder,
    setConfirmedTxsActiveSort,
    setConfirmedTxsActiveOrder,
    activeFilters: useAppSelector(txFilterAndSort[filterScope].selectors.selectActiveFilters),
    activeMempoolTxsSort: useAppSelector(
      txFilterAndSort[filterScope].selectors.selectMempoolTxsActiveSort
    ),
    activeMempoolTxsOrder: useAppSelector(
      txFilterAndSort[filterScope].selectors.selectMempoolTxsActiveOrder
    ),
    activeConfirmedTxsSort: useAppSelector(
      txFilterAndSort[filterScope].selectors.selectConfirmedTxsActiveSort
    ),
    activeConfirmedTxsOrder: useAppSelector(
      txFilterAndSort[filterScope].selectors.selectConfirmedTxsActiveOrder
    ),
  };
};
