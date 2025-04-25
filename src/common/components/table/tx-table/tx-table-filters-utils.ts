import { useShallowRouter } from '@/common/hooks/useShallowRouter';
import { useSearchParams } from 'next/navigation';

import { TX_TABLE_FILTER_KEYS, TxTableFilters } from './useTxTableFilters';

export function getSearchParamsWithoutTxTableFilters(searchParams: URLSearchParams) {
  const params = new URLSearchParams(searchParams);
  TX_TABLE_FILTER_KEYS.forEach(filter => {
    params.delete(filter);
  });
  return params;
}

export function useSearchParamsWithoutTxTableFilters() {
  const searchParams = useSearchParams();
  const paramsWithoutFilters = getSearchParamsWithoutTxTableFilters(searchParams);
  return paramsWithoutFilters;
}

export function useClearTxTableFiltersHandler() {
  const searchParamsWithoutFilters = useSearchParamsWithoutTxTableFilters();
  const shallowRouter = useShallowRouter();
  return () => {
    shallowRouter.replace(null, '', `?${searchParamsWithoutFilters.toString()}`);
  };
}

export function areAnyTxTableFiltersActive(filters: TxTableFilters) {
  return Object.keys(filters).some(filter => {
    const value = filters[filter as keyof TxTableFilters];
    if (Array.isArray(value)) {
      return value.length > 0;
    }
    return value !== '';
  });
}
