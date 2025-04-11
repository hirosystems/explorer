'use client';

import { TxTableFilters } from '@/common/components/table/filters/TxTableFilters';
import { TxTableFiltersModal } from '@/common/components/table/filters/TxTableFitlersModal';
import { TxsTable } from '@/common/components/table/table-examples/TxsTable';
import { useIsRedesignUrl } from '@/common/utils/url-utils';
import { TxListTabs } from '@/features/txs-list/tabs/TxListTabs';
import { Text } from '@/ui/Text';
import { ClientOnly, Flex, Stack } from '@chakra-ui/react';
import { DehydratedState, HydrationBoundary, useQueryClient } from '@tanstack/react-query';
import dynamic from 'next/dynamic';
import { useRef } from 'react';

import { TokenPrice } from '../../common/types/tokenPrice';
import { PageTitle } from '../_components/PageTitle';
import { TxPageFilters } from './page';
import { MempoolFeeStatsSkeleton } from './skeleton';

const MempoolFeeStatsDynamic = dynamic(
  () => import('./MempoolFeeStats').then(mod => mod.MempoolFeeStats),
  {
    loading: () => <MempoolFeeStatsSkeleton />,
    ssr: false,
  }
);

export default function ({
  tokenPrice,
  filters,
  dehydratedState,
}: {
  tokenPrice: TokenPrice;
  filters: TxPageFilters;
  dehydratedState: DehydratedState;
}) {
  const isRedesign = useIsRedesignUrl();

  const queryClient = useQueryClient();

  const clearCacheCount = useRef(0);

  /**
   * HACK: react query doesn't let us disable the cache (unless we set the gcTime to 0), which is causing flickering and hydration errors
   * By clearing the cache here, we ensure the tx table won't have a cache to fall back on, but still enable it to cache data while the user is on the this page
   */
  if (clearCacheCount.current === 0) {
    queryClient.removeQueries({
      queryKey: ['confirmedTransactions'],
    });
    clearCacheCount.current += 1;
  }

  return (
    <>
      <Flex justifyContent={'space-between'} alignItems={'flex-end'}>
        <PageTitle>Transactions</PageTitle>
      </Flex>
      <MempoolFeeStatsDynamic tokenPrice={tokenPrice} />
      <TxListTabs filters={filters as Record<string, string | undefined>} />
      <ClientOnly>
        {isRedesign ? (
          <HydrationBoundary state={dehydratedState}>
            <Stack gap={24} fontFamily="var(--font-instrument-sans)">
              {/* <Overview /> */}
              <Stack gap={8}>
                <Text textStyle="heading-md" color="textPrimary">
                  Latest transactions
                </Text>
                <Stack gap={5}>
                  <TxTableFilters filters={filters} />
                  <TxsTable filters={filters} />
                  <TxTableFiltersModal filters={filters} />
                </Stack>
              </Stack>
            </Stack>
          </HydrationBoundary>
        ) : null}
      </ClientOnly>
    </>
  );
}
