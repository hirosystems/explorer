import {
  UseQueryResult,
  useQueries,
  useQueryClient,
  useSuspenseQuery,
} from '@tanstack/react-query';
import { useCallback, useMemo, useState } from 'react';

import { useSuspenseCurrentStackingCycle } from '../../../app/_components/Stats/CurrentStackingCycle/useCurrentStackingCycle';
import { useGlobalContext } from '../../../common/context/useGlobalContext';
import { TEN_MINUTES } from '../../../common/queries/query-stale-time';
import {
  SignerMetricsSignerForCycle,
  useGetSignerMetricsSignerForCycleQuery,
} from './signer-metrics-hooks';

const SIGNER_QUERY_KEY = 'signer';

export interface SignerInfo {
  signing_key: string;
  signer_address: string;
  weight: number;
  stacked_amount: string;
  weight_percent: number;
  stacked_amount_percent: number;
  solo_stacker_count: number;
  pooled_stacker_count: number;
}

export interface StackingHistoryInfo extends SignerMetricsSignerForCycle {
  cycleid: number;
}

export function useSuspensePoxSigner(cycleId: number, signerKey: string) {
  const { url: activeNetworkUrl } = useGlobalContext().activeNetwork;

  return useSuspenseQuery<SignerInfo>({
    queryKey: [SIGNER_QUERY_KEY, cycleId, signerKey],
    queryFn: () =>
      fetch(`${activeNetworkUrl}/extended/v2/pox/cycles/${cycleId}/signers/${signerKey}`).then(
        res => res.json()
      ),
    staleTime: TEN_MINUTES,
  });
}

const DEFAULT_LIST_LIMIT = 5;

export function useSignerStackingHistory(signerKey: string, selectedCycle?: string) {
  const { currentCycleId } = useSuspenseCurrentStackingCycle();
  const getQuery = useGetSignerMetricsSignerForCycleQuery();
  const [offset, setOffset] = useState(0);
  const cyclesToQuery = useMemo(() => {
    return selectedCycle
      ? [parseInt(selectedCycle)]
      : Array.from({ length: offset + DEFAULT_LIST_LIMIT }, (_, i) => currentCycleId - i);
  }, [selectedCycle, currentCycleId, offset]);
  const queryClient = useQueryClient();
  const queries = useMemo(() => {
    return cyclesToQuery.map(cycle => {
      return getQuery(cycle, signerKey);
    });
  }, [cyclesToQuery, getQuery, signerKey]);

  const signerStackingHistoryQueries = useMemo(() => {
    return {
      queries,
      combine: (response: UseQueryResult<SignerMetricsSignerForCycle, Error>[]) => {
        return response.map(r => r.data);
      },
    };
  }, [queries]);
  const signerStackingHistory = useQueries(signerStackingHistoryQueries, queryClient);

  // We don't have a list endpoint for the stacking history, so we don't know when to stop fetching for more cycles. 404s tell us that we've reached the end.
  const foundStackingHistory404s = useMemo(() => {
    return signerStackingHistory.some(r => {
      if (r && 'error' in r) {
        return true;
      }
      return false;
    });
  }, [signerStackingHistory]);

  const signerStackingHistoryFiltered = useMemo(() => {
    return signerStackingHistory
      .filter(
        (data): data is SignerMetricsSignerForCycle | undefined =>
          data !== null && data !== undefined
      )
      .filter((r): r is SignerMetricsSignerForCycle => {
        if (r && 'error' in r) {
          return false;
        }
        return true;
      })
      .map((r, index) => ({
        ...(r as SignerMetricsSignerForCycle),
        cycleid: cyclesToQuery[index],
      }));
  }, [signerStackingHistory, cyclesToQuery]);

  const fetchNextPage = useCallback(() => {
    setOffset(prev => prev + DEFAULT_LIST_LIMIT);
  }, []);

  const hasNextPage = useMemo(() => {
    return !foundStackingHistory404s;
  }, [foundStackingHistory404s]);

  return {
    signerStackingHistory: signerStackingHistoryFiltered,
    fetchNextPage: selectedCycle ? undefined : fetchNextPage,
    hasNextPage: selectedCycle ? false : hasNextPage,
  };
}
