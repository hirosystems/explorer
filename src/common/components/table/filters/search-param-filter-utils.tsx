import { useSearchParams } from 'next/navigation';
import { useMemo } from 'react';

import { FilterSearchParam, FilterSearchParams, filterSearchParamsList } from './types';

export function getSearchParamsWithoutFilters(searchParams: URLSearchParams) {
  const params = new URLSearchParams(searchParams);
  filterSearchParamsList.forEach(filter => {
    params.delete(filter);
  });
  return params;
}

export function useSearchParamsWithoutFilters() {
  const searchParams = useSearchParams();
  const paramsWithoutFilters = getSearchParamsWithoutFilters(searchParams);
  return paramsWithoutFilters;
}

export function parseSearchParamFilter(searchParam: string) {
  switch (searchParam) {
    case FilterSearchParam.TRANSACTION_TYPE:
      return searchParam.split(',');
    default:
      return searchParam;
  }
}

export function useSearchParamsFilters(): FilterSearchParams {
  const searchParams = useSearchParams();
  return useMemo(() => {
    const filters: FilterSearchParams = {
      fromAddress: '',
      toAddress: '',
      startTime: '',
      endTime: '',
      transactionType: [],
    };
    Object.keys(filters).forEach(filter => {
      if (searchParams.has(filter)) {
        const value = searchParams.get(filter);
        if (value) {
          if (filter === FilterSearchParam.TRANSACTION_TYPE) {
            filters[filter] = value.split(',');
          } else if (
            filter === FilterSearchParam.START_TIME ||
            filter === FilterSearchParam.END_TIME ||
            filter === FilterSearchParam.FROM_ADDRESS ||
            filter === FilterSearchParam.TO_ADDRESS
          ) {
            filters[filter] = value;
          }
        }
      }
    });

    return filters;
  }, [searchParams]);
}

export function areAnySearchParamsFiltersActive(filters: FilterSearchParams) {
  return Object.keys(filters).some(filter => {
    const value = filters[filter as keyof FilterSearchParams];
    if (Array.isArray(value)) {
      return value.length > 0;
    }
    return value !== '';
  });
}
