'use client';

import { THIRTY_SECONDS } from '@/common/queries/query-stale-time';
import { Text } from '@/ui/Text';
import { Stack } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import { ComponentProps, useEffect, useMemo, useState } from 'react';

import { BondsTable } from './BondsTable';
import { deserializeBondRewards } from './bond-reward-history';
import type { BondRewardHistory } from './bond-reward-history';
import { BONDS_TABLE_LIMIT } from './consts';

export interface RewardHistoryNetwork {
  chain: string;
  api?: string;
}

type Props = ComponentProps<typeof BondsTable> & { rewardHistoryNetwork?: RewardHistoryNetwork };

export function OverviewBondsTable({ rewardHistoryNetwork, ...props }: Props) {
  return rewardHistoryNetwork ? (
    <PaginatedRewardTable {...props} network={rewardHistoryNetwork} />
  ) : (
    <BondsTable {...props} />
  );
}

function PaginatedRewardTable({
  network,
  bonds,
  rewardsByBond,
  settlementsByBond,
  ...props
}: ComponentProps<typeof BondsTable> & { network: RewardHistoryNetwork }) {
  const [pageIndex, setPageIndex] = useState(0);
  const sorted = useMemo(() => [...bonds].sort((a, b) => b.index - a.index), [bonds]);
  useEffect(() => setPageIndex(0), [bonds, network.chain, network.api]);
  const visible = sorted.slice(pageIndex * BONDS_TABLE_LIMIT, (pageIndex + 1) * BONDS_TABLE_LIMIT);
  const missing = visible
    .filter(
      bond =>
        rewardsByBond?.[bond.index] === undefined || settlementsByBond?.[bond.index] === undefined
    )
    .map(bond => bond.index);
  const { data, isFetching, isError } = useQuery({
    queryKey: ['staking-bond-rewards', network.chain, network.api, missing],
    queryFn: async ({ signal }) => {
      const params = new URLSearchParams({ chain: network.chain });
      if (network.api !== undefined) params.set('api', network.api);
      missing.forEach(index => params.append('bond', String(index)));
      const response = await fetch(`/api/staking/bond-rewards?${params}`, { signal });
      if (!response.ok) throw new Error(`Reward history request failed: ${response.status}`);
      return deserializeBondRewards((await response.json()) as BondRewardHistory);
    },
    enabled: missing.length > 0,
    staleTime: THIRTY_SECONDS,
    refetchOnWindowFocus: false,
    retry: false,
  });
  return (
    <Stack gap={2}>
      <Text role="status" aria-live="polite" textStyle="text-regular-xs" color="textSecondary">
        {isFetching
          ? 'Loading rewards…'
          : isError
            ? 'Some reward data could not be loaded. Refresh to try again.'
            : ''}
      </Text>
      <BondsTable
        {...props}
        bonds={visible}
        rewardsByBond={{ ...data?.byBondIndex, ...rewardsByBond }}
        settlementsByBond={{ ...data?.settlementsByBond, ...settlementsByBond }}
        serverPagination={{
          pageIndex,
          pageSize: BONDS_TABLE_LIMIT,
          totalRows: bonds.length,
          onPageChange: next => setPageIndex(next.pageIndex),
        }}
      />
    </Stack>
  );
}
