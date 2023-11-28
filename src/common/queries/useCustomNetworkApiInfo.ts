import { UseQueryOptions, useQuery } from '@tanstack/react-query';

import { CoreNodeInfoResponse } from '@stacks/blockchain-api-client/src/generated/models';

import { useApi } from '../api/useApi';
import { DEFAULT_V2_INFO_ENDPOINT } from '../constants/constants';
import { ONE_MINUTE } from './query-stale-time';

export const getCustomNetworkApiInfo = (baseUrl: string) => () =>
  fetch(`${baseUrl}${DEFAULT_V2_INFO_ENDPOINT}`).then(res => res.json());

export function useCustomNetworkApiInfo(
  url: string,
  options: Omit<UseQueryOptions<CoreNodeInfoResponse, Error>, 'queryKey'> = {}
) {
  const api = useApi();
  return useQuery<CoreNodeInfoResponse, Error>({
    queryKey: ['customNetworkApiInfo', url],
    queryFn: getCustomNetworkApiInfo(url),
    staleTime: ONE_MINUTE,
    ...options,
  });
}
