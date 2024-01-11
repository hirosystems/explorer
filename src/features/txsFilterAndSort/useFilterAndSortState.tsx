'use client';

import {
  GetMempoolTransactionListOrderByEnum,
  GetMempoolTransactionListOrderEnum,
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

  const setActiveSort = (sort: GetMempoolTransactionListOrderByEnum) => {
    dispatch(txFilterAndSort[filterScope].actions.setActiveSort(sort));
  };

  const setActiveOrder = (order: GetMempoolTransactionListOrderEnum) => {
    dispatch(txFilterAndSort[filterScope].actions.setActiveOrder(order));
  };

  return {
    setActiveFilters,
    setActiveSort,
    setActiveOrder,
    activeFilters: useAppSelector(txFilterAndSort[filterScope].selectors.selectActiveFilters),
    activeSort: useAppSelector(txFilterAndSort[filterScope].selectors.selectActiveSort),
    activeOrder: useAppSelector(txFilterAndSort[filterScope].selectors.selectActiveOrder),
  };
};
