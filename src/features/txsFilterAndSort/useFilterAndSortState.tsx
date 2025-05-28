'use client';

import { operations } from '@stacks/blockchain-api-client/lib/generated/schema';

import { useAppDispatch, useAppSelector } from '../../common/state/hooks';
import { txFilterAndSort } from './txsFilterAndSortSlice';
import { useFilterAndSortScope } from './useFilterAndSortScope';

/**
 * Type definitions for mempool transaction queries and sorting options.
 * These types are derived from the Stacks blockchain API client schema.
 */
type MempoolQuery = NonNullable<operations['get_mempool_transaction_list']['parameters']['query']>;
type MempoolOrderBy = Exclude<MempoolQuery['order_by'], undefined>;
type MempoolOrder = Exclude<MempoolQuery['order'], undefined>;

/**
 * Type definitions for confirmed transaction queries and sorting options.
 * These types are derived from the Stacks blockchain API client schema.
 */
type TxsQuery = NonNullable<operations['get_transaction_list']['parameters']['query']>;
type TxSortBy = Exclude<TxsQuery['sort_by'], undefined>;
type TxOrder = Exclude<TxsQuery['order'], undefined>;

/**
 * A hook that provides access to and control over transaction filtering and sorting state.
 *
 * This hook combines the current filter scope (determined by the current route) with
 * Redux state management to provide a complete interface for managing transaction
 * filters and sort options.
 *
 * The hook provides:
 * - State selectors for current filter and sort values
 * - Action dispatchers for updating filter and sort values
 * - Automatic scope management based on the current route
 *
 * @returns {Object} An object containing:
 *   - State selectors for current values
 *   - Action dispatchers for updating values
 *
 * @example
 * const {
 *   activeFilters,
 *   setActiveFilters,
 *   activeMempoolTxsSort,
 *   setMempoolTxsActiveSort,
 *   // ... other values and setters
 * } = useFilterAndSortState();
 */
export const useFilterAndSortState = () => {
  const dispatch = useAppDispatch();
  // Get the current filter scope based on the route
  const filterScope = useFilterAndSortScope();

  /**
   * Action dispatchers for updating filter and sort state.
   * These functions dispatch actions to the Redux store with the current filter scope.
   */
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
    // Action dispatchers for updating state
    setActiveFilters,
    setMempoolTxsActiveSort,
    setMempoolTxsActiveOrder,
    setConfirmedTxsActiveSort,
    setConfirmedTxsActiveOrder,

    // State selectors for current values
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
