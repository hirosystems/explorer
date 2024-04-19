import { useSuspenseQuery } from '@tanstack/react-query';

import { useApi } from '../api/useApi';
import { ONE_MINUTE } from './query-stale-time';

export function useSuspenseMempoolFee(options: any = {}) {
  const api = useApi();
  return useSuspenseQuery({
    queryKey: ['mempoolFee'],
    queryFn: () => {
      return api.mempoolApi.getMempoolFeePriorities();
    },
    staleTime: ONE_MINUTE,
    ...options,
  });
}
