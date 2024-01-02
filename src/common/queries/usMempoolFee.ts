import {
  UseQueryOptions,
  UseSuspenseQueryOptions,
  useQuery,
  useSuspenseQuery,
} from '@tanstack/react-query';
import { address } from 'bitcoinjs-lib';

import { MempoolFeePriorities } from '@stacks/blockchain-api-client/src/generated/models';
import { AddressBalanceResponse } from '@stacks/stacks-blockchain-api-types';

import { useApi } from '../api/useApi';
import { ONE_MINUTE } from './query-stale-time';

export function useMempoolFee(options: any = {}) {
  const api = useApi();
  return useQuery({
    queryKey: ['mempoolFee'],
    queryFn: () => {
      return api.mempoolApi.getMempoolFeePriorities();
    },
    staleTime: ONE_MINUTE,
    ...options,
  });
}

export function useSuspenseMempoolFee(options: any = {}) {
  const api = useApi();
  if (!address) throw new Error('Address is required');
  return useSuspenseQuery({
    queryKey: ['mempoolFee'],
    queryFn: () => {
      return api.mempoolApi.getMempoolFeePriorities();
    },
    staleTime: ONE_MINUTE,
    ...options,
  });
}
