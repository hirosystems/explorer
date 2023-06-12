import { useQuery } from 'react-query';
import { fetchTestnetStatus } from '../server-calls/fetchTestnetStatus';
import { TEN_MINUTES } from './query-stale-time';

export const useTestnetStatus = () => {
  return useQuery(['testnetstatus', 'testnetstatus'], fetchTestnetStatus, {
    staleTime: TEN_MINUTES,
  });
};
