import { useFilterScope } from '@features/transactions-filter/hooks/use-filter-scope';
import { txFilters } from '@features/transactions-filter/transactions-filter-slice';

import { GetTransactionListTypeEnum } from '@stacks/blockchain-api-client';

import { useAppDispatch, useAppSelector } from '@common/state/hooks';

export const useFilterState = () => {
  const dispatch = useAppDispatch();
  const filterScope = useFilterScope();

  const toggleFilterVisibility = () => {
    dispatch(txFilters[filterScope].actions.toggleVisibility());
  };

  const toggleFilter = (filter: GetTransactionListTypeEnum) => {
    dispatch(txFilters[filterScope].actions.toggleFilter(filter));
  };

  return {
    toggleFilterVisibility,
    toggleFilter,
    isVisible: useAppSelector(txFilters[filterScope].selectors.selectIsVisible),
    activeFilters: useAppSelector(txFilters[filterScope].selectors.selectActiveFilters),
  };
};
