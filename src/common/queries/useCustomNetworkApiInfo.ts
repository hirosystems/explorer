import { useQuery } from '@tanstack/react-query';

import { DEFAULT_V2_INFO_ENDPOINT } from '../constants/constants';
import { ONE_MINUTE } from './query-stale-time';

export const getCustomNetworkApiInfo = (baseUrl: string) => () =>
  fetch(`${baseUrl}${DEFAULT_V2_INFO_ENDPOINT}`).then(res => res.json());

export function useCustomNetworkApiInfo(url: string, options: any = {}) {
  return useQuery({
    queryKey: ['customNetworkApiInfo', url],
    queryFn: getCustomNetworkApiInfo(url),
    staleTime: ONE_MINUTE,
    ...options,
  });
}
