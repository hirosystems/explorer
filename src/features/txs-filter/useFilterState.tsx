'use client';

import { GetTransactionListTypeEnum } from '@stacks/blockchain-api-client';

import { useAppDispatch, useAppSelector } from '../../common/state/hooks';
import { txFilters } from './transactions-filter-slice';
import { useFilterScope } from './useFilterScope';

export const useFilterState = () => {
  const dispatch = useAppDispatch();
  const filterScope = useFilterScope();

  const toggleFilterVisibility = () => {
    dispatch(txFilters[filterScope].actions.toggleVisibility());
  };

  const toggleFilter = (filter: string) => {
    dispatch(txFilters[filterScope].actions.toggleFilter(filter));
  };

  return {
    toggleFilterVisibility,
    toggleFilter,
    isVisible: useAppSelector(txFilters[filterScope].selectors.selectIsVisible),
    activeFilters: useAppSelector(txFilters[filterScope].selectors.selectActiveFilters),
  };
};
