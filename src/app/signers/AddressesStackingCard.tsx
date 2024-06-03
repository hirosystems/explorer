import { ArrowDownRight, ArrowUpRight } from '@phosphor-icons/react';
import { UseQueryResult, useQueries, useQueryClient } from '@tanstack/react-query';
import { Suspense, useMemo } from 'react';

import { Card } from '../../common/components/Card';
import { ApiResponseWithResultsOffset } from '../../common/types/api';
import { Icon } from '../../ui/Icon';
import { Text } from '../../ui/Text';
import { ExplorerErrorBoundary } from '../_components/ErrorBoundary';
import { useSuspenseCurrentStackingCycle } from '../_components/Stats/CurrentStackingCycle/useCurrentStackingCycle';
import { StatCardBase } from './StatsCardBase';
import { SignersStackersData, useGetStackersBySignerQuery } from './data/UseSignerAddresses';
import { useSuspensePoxSigners } from './data/useSigners';
import { SignersStatsSectionSkeleton } from './skeleton';

export function AddressesStackingCardBase() {
  const { currentCycleId } = useSuspenseCurrentStackingCycle();
  const previousCycleId = useMemo(() => currentCycleId - 1, [currentCycleId]);

  const {
    data: { results: currentCycleSigners },
  } = useSuspensePoxSigners(currentCycleId);

  if (!currentCycleSigners) {
    throw new Error('No stacking data available');
  }

  const {
    data: { results: previousCycleSigners },
  } = useSuspensePoxSigners(previousCycleId);

  const queryClient = useQueryClient();
  const getQuery = useGetStackersBySignerQuery();
  const currentCycleSignersStackersQueries = useMemo(() => {
    return {
      queries: currentCycleSigners.map(signer => {
        return getQuery(currentCycleId, signer.signing_key);
      }),
      combine: (
        response: UseQueryResult<ApiResponseWithResultsOffset<SignersStackersData>, Error>[]
      ) => response.map(r => r.data?.results ?? []),
    };
  }, [currentCycleSigners, getQuery, currentCycleId]);
  const previousCycleSignersStackersQueries = useMemo(() => {
    return {
      queries: previousCycleSigners
        ? previousCycleSigners.map(signer => {
            return getQuery(previousCycleId, signer.signing_key);
          })
        : [],
      combine: (
        response: UseQueryResult<ApiResponseWithResultsOffset<SignersStackersData>, Error>[]
      ) => response.map(r => r.data?.results ?? []),
    };
  }, [previousCycleSigners, getQuery, previousCycleId]);

  const currentCycleSignersStackers = useQueries(currentCycleSignersStackersQueries, queryClient);
  const previousCycleSignersStackers = useQueries(previousCycleSignersStackersQueries, queryClient);

  const numCurrentCycleStackers = currentCycleSignersStackers.length;
  const numPreviousCycleStackers = previousCycleSignersStackers.length;

  const rate = numPreviousCycleStackers
    ? Number(
        (
          ((numCurrentCycleStackers - numPreviousCycleStackers) / numPreviousCycleStackers) *
          100
        ).toFixed(2)
      )
    : undefined;
  console.log({ rate });

  const moreInfo = rate ? (
    <Text lineHeight={4} fontSize="xs" fontWeight="medium" color="textSubdued">
      <Text display="inline" whiteSpace="nowrap">
        <Icon
          as={rate > 0 ? ArrowUpRight : ArrowDownRight}
          size={3}
          color={rate > 0 ? 'green.600' : 'red.600'}
        />
        &nbsp;{`${rate}%`}&nbsp;
      </Text>
      <Text display="inline">{`${rate > 0 ? 'more' : 'less'} than previous cycle`}</Text>
    </Text>
  ) : null;

  return (
    <StatCardBase
      statTitle="Addresses stacking"
      statValue={numCurrentCycleStackers.toString()}
      moreInfo={moreInfo}
    />
  );
}

export function AddressesStackingCard() {
  return (
    <ExplorerErrorBoundary Wrapper={Card} tryAgainButton>
      <Suspense fallback={<SignersStatsSectionSkeleton />}>
        <AddressesStackingCardBase />
      </Suspense>
    </ExplorerErrorBoundary>
  );
}
