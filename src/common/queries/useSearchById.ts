import { UseQueryResult, useQuery } from '@tanstack/react-query';

import { SearchSuccessResult } from '@stacks/stacks-blockchain-api-types';

import { useApi } from '../api/useApi';
import { ONE_MINUTE } from './query-stale-time';

export function useSearchById(id: string, options: any = {}): UseQueryResult<SearchSuccessResult> {
  const api = useApi();
  return useQuery({
    queryKey: ['search-by-id', id],
    queryFn: async () => {
      try {
        return api.searchApi.searchById({ id, includeMetadata: true });
      } catch (e: any) {
        try {
          const data = await e.json();
          if (data && 'found' in data) {
            throw data;
          }
        } catch (e) {
          throw e;
        }
      }
    },
    staleTime: ONE_MINUTE,
    ...options,
  });
}
