'use client';

import { PoxInfo } from '@/common/queries/usePoxInforRaw';
import { Text } from '@/ui/Text';
import { Stack } from '@chakra-ui/react';
import type { ComponentProps } from 'react';

import { CurrentBond } from './CurrentBond';
import { OverviewBondsTable } from './OverviewBondsTable';
import type { RewardHistoryNetwork } from './OverviewBondsTable';
import { PeriodsOverview } from './PeriodsOverview';
import { StackingOverview } from './StackingOverview';
import type { Bond, BondRewards, EnrollmentShare, ProjectedBond } from './data';
import { getBondProjections } from './projections';

export interface StakingPageData {
  bonds: Bond[];
  projectedBonds?: ProjectedBond[];
  hasMoreBonds?: boolean;
  rewardHistoryNetwork?: RewardHistoryNetwork;
  bondsUnavailable?: boolean;
  poxInfo?: PoxInfo;
  currentBurnHeight: number;
  nowMs: number;
  rewardCycleLength: number;
  prepareCycleLength: number;
  firstBurnchainBlockHeight: number;
  enrollments?: EnrollmentShare[];
  rewarded?: BondRewards;
  burnBlockTimes: Record<number, number>;
}

export type StackingPageData = Omit<ComponentProps<typeof StackingOverview>, 'poxInfo'> & {
  poxInfo?: PoxInfo;
};

export function StackingPageClient({ poxInfo, ...props }: StackingPageData) {
  return poxInfo ? <StackingOverview {...props} poxInfo={poxInfo} /> : null;
}

export function StakingPageClient({
  bonds,
  hasMoreBonds,
  rewardHistoryNetwork,
  bondsUnavailable,
  projectedBonds,
  poxInfo,
  currentBurnHeight,
  nowMs,
  rewardCycleLength,
  prepareCycleLength,
  firstBurnchainBlockHeight,
  enrollments,
  rewarded,
  burnBlockTimes,
}: StakingPageData) {
  const { featuredIndex, featuredBond, nextBond, scheduledBonds } = getBondProjections(
    bonds,
    rewardCycleLength,
    currentBurnHeight,
    projectedBonds
  );
  return (
    <Stack gap={{ base: 10, lg: 12 }}>
      {bondsUnavailable || !poxInfo ? (
        <Text role="status" textStyle="text-regular-sm" color="textSecondary">
          Some staking data could not be loaded. Refresh the page to try again.
        </Text>
      ) : bonds.length === 0 ? (
        <Text textStyle="text-regular-sm" color="textSecondary">
          No bonds yet. Bonds appear here once they are created on-chain.
        </Text>
      ) : null}
      {!poxInfo && !bondsUnavailable && bonds.length > 0 && (
        <Stack gap={4}>
          <Text as="h2" textStyle="heading-xs">
            Bonds
          </Text>
          <OverviewBondsTable
            rewardHistoryNetwork={rewardHistoryNetwork}
            bonds={bonds}
            currentBurnHeight={undefined}
            nowMs={nowMs}
            rewardsByBond={rewarded?.byBondIndex}
            settlementsByBond={rewarded?.settlementsByBond}
            burnBlockTimes={burnBlockTimes}
          />
        </Stack>
      )}
      {poxInfo && (
        <>
          <Stack gap={4}>
            <CurrentBond
              featuredBond={featuredBond}
              nextBond={nextBond}
              burnBlockTimes={burnBlockTimes}
              settlements={
                featuredIndex !== undefined && rewarded
                  ? rewarded.settlementsByBond[featuredIndex]
                  : undefined
              }
              enrollments={enrollments}
              rewardCycleLength={rewardCycleLength}
              prepareCycleLength={prepareCycleLength}
              currentBurnHeight={currentBurnHeight}
              nowMs={nowMs}
            />
          </Stack>
          <PeriodsOverview
            hasMoreBonds={hasMoreBonds}
            rewardHistoryNetwork={rewardHistoryNetwork}
            settlementsByBond={rewarded?.settlementsByBond}
            burnBlockTimes={burnBlockTimes}
            bonds={bonds}
            featuredIndex={featuredIndex}
            rewardsByBond={rewarded?.byBondIndex}
            scheduledBonds={scheduledBonds}
            rewardCycleLength={rewardCycleLength}
            prepareCycleLength={prepareCycleLength}
            firstBurnchainBlockHeight={firstBurnchainBlockHeight}
            currentBurnHeight={currentBurnHeight}
            nowMs={nowMs}
          />
        </>
      )}
    </Stack>
  );
}
