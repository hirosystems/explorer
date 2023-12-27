'use client';

import { useAppDispatch, useAppSelector } from '../../common/state/hooks';
import { txFilters } from './transactions-filter-slice';
import { useFilterScope } from './useFilterScope';

export const useFilterState = () => {
  const dispatch = useAppDispatch();
  const filterScope = useFilterScope();

  const setActiveFilters = (filters: string[]) => {
    dispatch(txFilters[filterScope].actions.setActiveFilters(filters));
  };

  return {
    setActiveFilters,
    activeFilters: useAppSelector(txFilters[filterScope].selectors.selectActiveFilters),
  };
};
