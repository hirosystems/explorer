import { txFilters, TxFilterTypes } from '@features/transactions-filter/transactions-filter-slice';
import { useAppDispatch, useAppSelector } from '@common/state/hooks';
import { GetTransactionListTypeEnum } from '@stacks/blockchain-api-client';

export const useFilterState = (filterType: TxFilterTypes) => {
  const dispatch = useAppDispatch();

  const toggleFilterVisibility = () => {
    dispatch(txFilters[filterType].actions.toggleVisibility());
  };

  const toggleFilter = (filter: GetTransactionListTypeEnum) => {
    dispatch(txFilters[filterType].actions.toggleFilter(filter));
  };

  return {
    toggleFilterVisibility,
    toggleFilter,
    isVisible: useAppSelector(txFilters[filterType].selectors.selectIsVisible),
    activeFilters: useAppSelector(txFilters[filterType].selectors.selectActiveFilters),
  };
};
