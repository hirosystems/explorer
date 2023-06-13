import { useQuery } from 'react-query';
import { fetchTsOfChainTip } from '../server-calls/fetchTestnetStatus';
import { TEN_MINUTES } from './query-stale-time';
import { useApi } from '@/common/api/client';

export const useTestnetStatus = (api: ReturnType<typeof useApi>) => {
  return useQuery('testnetstatus', () => fetchTsOfChainTip(api), {
    staleTime: TEN_MINUTES,
  });
};
