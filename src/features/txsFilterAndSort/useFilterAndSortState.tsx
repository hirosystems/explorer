'use client';

import { operations } from '@stacks/blockchain-api-client/lib/generated/schema';

import { useAppDispatch, useAppSelector } from '../../common/state/hooks';
import { txFilterAndSort } from './txsFilterAndSortSlice';
import { useFilterAndSortScope } from './useFilterAndSortScope';

type MempoolQuery = NonNullable<operations['get_mempool_transaction_list']['parameters']['query']>;
type MempoolOrderBy = Exclude<MempoolQuery['order_by'], undefined>;
type MempoolOrder = Exclude<MempoolQuery['order'], undefined>;

type TxsQuery = NonNullable<operations['get_transaction_list']['parameters']['query']>;
type TxSortBy = Exclude<TxsQuery['sort_by'], undefined>;
type TxOrder = Exclude<TxsQuery['order'], undefined>;

export const useFilterAndSortState = () => {
  const dispatch = useAppDispatch();
  const filterScope = useFilterAndSortScope();

  const setActiveFilters = (filters: string[]) => {
    dispatch(txFilterAndSort[filterScope].actions.setActiveFilters(filters));
  };

  const setMempoolTxsActiveSort = (sort: MempoolOrderBy) => {
    dispatch(txFilterAndSort[filterScope].actions.setMempoolTxsActiveSort(sort));
  };

  const setMempoolTxsActiveOrder = (order: MempoolOrder) => {
    dispatch(txFilterAndSort[filterScope].actions.setMempoolTxsActiveOrder(order));
  };

  const setConfirmedTxsActiveSort = (sort: TxSortBy) => {
    dispatch(txFilterAndSort[filterScope].actions.setConfirmedTxsActiveSort(sort));
  };

  const setConfirmedTxsActiveOrder = (order: TxOrder) => {
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
