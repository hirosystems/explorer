import { TWO_MINUTES } from '@/common/queries/query-stale-time';
import { ApiResponseWithResultsOffset } from '@/common/types/api';
import { getNextPageParam } from '@/common/utils/utils';
import {
  InfiniteData,
  UseInfiniteQueryResult,
  useInfiniteQuery,
  useSuspenseQuery,
} from '@tanstack/react-query';

import { useGlobalContext } from '../../../common/context/useGlobalContext';

const SIGNER_METRICS_STATUS_QUERY_KEY = 'signer-metrics-status';
const SIGNER_METRICS_SIGNERS_FOR_CYCLE_QUERY_KEY = 'signer-metrics-signers-for-cycle';
const SIGNER_METRICS_SIGNER_FOR_CYCLE_QUERY_KEY = 'signer-metrics-signer-for-cycle';
const SIGNER_METRICS_BLOCKS_QUERY_KEY = 'signer-metrics-blocks';
const SIGNER_METRICS_BLOCK_QUERY_KEY = 'signer-metrics-block';

export interface SignerMetricsStatus {
  server_version: string;
  status: string;
  chain_tip: {
    block_height: number;
  };
}

export interface SignerMetricsSignerForCycle {
  signer_key: string;
  weight: number;
  weight_percentage: number;
  stacked_amount: string;
  stacked_amount_percent: number;
  proposals_accepted_count: number;
  proposals_rejected_count: number;
  proposals_missed_count: number;
  average_response_time_ms: number;
}

export interface SignerMetricsBlock {
  block_height: number;
  block_hash: string;
  block_time: number;
  index_block_hash: string;
  burn_block_height: number;
  tenure_height: number;
  signer_data: {
    cycle_number: number;
    total_signer_count: number;
    accepted_count: number;
    rejected_count: number;
    missing_count: number;
    accepted_excluded_count: number;
    average_response_time_ms: number;
    block_proposal_time_ms: number;
    accepted_stacked_amount: string;
    rejected_stacked_amount: string;
    missing_stacked_amount: string;
    accepted_weight: number;
    rejected_weight: number;
    missing_weight: number;
  };
}

export function useSignerMetricsStatus(signerKey: string) {
  const { url: activeNetworkUrl } = useGlobalContext().activeNetwork;

  return useSuspenseQuery<SignerMetricsStatus>({
    queryKey: [SIGNER_METRICS_STATUS_QUERY_KEY, signerKey],
    queryFn: () => fetch(`${activeNetworkUrl}`).then(res => res.json()),
  });
}

const DEFAULT_LIST_LIMIT = 10;

const fetchSignersForCycle = async (
  apiUrl: string,
  cycleId: number,
  pageParam: number,
  options: any
): Promise<ApiResponseWithResultsOffset<SignerMetricsSignerForCycle[]>> => {
  const limit = options.limit || DEFAULT_LIST_LIMIT;
  const offset = pageParam || 0;
  const queryString = new URLSearchParams({
    limit: limit.toString(),
    offset: offset.toString(),
  }).toString();
  const response = await fetch(
    `${apiUrl}/signer-metrics/v1/cycles/${cycleId}/signers${queryString ? `?${queryString}` : ''}`
  );
  return response.json();
};

export function useSignerMetricsSignersForCycle(
  cycleId: number,
  options: any = {}
): UseInfiniteQueryResult<
  InfiniteData<ApiResponseWithResultsOffset<SignerMetricsSignerForCycle[]>>
> {
  const { url: activeNetworkUrl } = useGlobalContext().activeNetwork;

  return useInfiniteQuery<ApiResponseWithResultsOffset<SignerMetricsSignerForCycle[]>>({
    queryKey: [SIGNER_METRICS_SIGNERS_FOR_CYCLE_QUERY_KEY, cycleId],
    queryFn: ({ pageParam }: { pageParam: number }) =>
      fetchSignersForCycle(activeNetworkUrl, cycleId, pageParam, options),
    getNextPageParam,
    initialPageParam: 0,
    staleTime: TWO_MINUTES,
    enabled: !!cycleId,
    ...options,
  });
}

export function useSignerMetricsSignerForCycle(cycleId: number, signerKey: string) {
  const { url: activeNetworkUrl } = useGlobalContext().activeNetwork;

  return useSuspenseQuery<SignerMetricsSignerForCycle>({
    queryKey: [SIGNER_METRICS_SIGNER_FOR_CYCLE_QUERY_KEY, cycleId, signerKey],
    queryFn: () =>
      fetch(`${activeNetworkUrl}/signer-metrics/v1/cycles/${cycleId}/signers/${signerKey}`).then(
        res => res.json()
      ),
  });
}

const fetchBlocks = async (
  apiUrl: string,
  pageParam: number,
  options: any
): Promise<ApiResponseWithResultsOffset<SignerMetricsBlock[]>> => {
  const limit = options.limit || DEFAULT_LIST_LIMIT;
  const offset = pageParam || 0;
  const queryString = new URLSearchParams({
    limit: limit.toString(),
    offset: offset.toString(),
  }).toString();
  const response = await fetch(
    `${apiUrl}/signer-metrics/v1/blocks${queryString ? `?${queryString}` : ''}`
  );
  return response.json();
};

export function useSignerMetricsBlocks(options: any = {}) {
  const { url: activeNetworkUrl } = useGlobalContext().activeNetwork;

  return useInfiniteQuery<ApiResponseWithResultsOffset<SignerMetricsBlock[]>>({
    queryKey: [SIGNER_METRICS_BLOCKS_QUERY_KEY],
    queryFn: ({ pageParam }: { pageParam: number }) =>
      fetchBlocks(activeNetworkUrl, pageParam, options),
    getNextPageParam,
    initialPageParam: 0,
    staleTime: TWO_MINUTES,
    ...options,
  });
}

export function useSignerMetricsBlock(blockHash: string) {
  const { url: activeNetworkUrl } = useGlobalContext().activeNetwork;

  return useSuspenseQuery<SignerMetricsBlock>({
    queryKey: [SIGNER_METRICS_BLOCK_QUERY_KEY, blockHash],
    queryFn: () =>
      fetch(`${activeNetworkUrl}/signer-metrics/v1/blocks/${blockHash}`).then(res => res.json()),
  });
}

export function useGetSignerMetricsBySignerQuery() {
  const { url: activeNetworkUrl } = useGlobalContext().activeNetwork;

  return (cycleId: number, signerKey: string) => ({
    queryKey: [SIGNER_METRICS_SIGNER_FOR_CYCLE_QUERY_KEY, cycleId, signerKey],
    queryFn: () =>
      fetch(`${activeNetworkUrl}/signer-metrics/v1/cycles/${cycleId}/signers/${signerKey}`).then(
        res => res.json()
      ),
    staleTime: TWO_MINUTES,
    cacheTime: 15 * 60 * 1000,
    refetchOnWindowFocus: false,
    enabled: !!cycleId && !!signerKey,
  });
}
