'use client';

import { getTxTypeIcon } from '@/common/components/TxIcon';
import { Flex, FlexProps } from '@chakra-ui/react';

import { MempoolFeePriorities } from '@stacks/stacks-blockchain-api-types/generated';

import {
  SkeletonCircle,
  Skeleton as SkeletonItem,
  SkeletonText,
} from '../../components/ui/skeleton';
import { pieChartHeight, pieChartWidth } from './MempoolFeePieChart';
import {
  MempoolFeePieChartSectionLayout,
  MempoolFeeStatLineLayout,
} from './MempoolFeePieChartSection';
import {
  MempoolFeePriorityCardLayout,
  MempoolFeePriorityCardTitle,
  MempoolFeePriorityCardTransactionTypeFeeStatLineLayout,
  MempoolFeePriorityCardsLayout,
} from './MempoolFeePriorityCardsSection';
import { MempoolFeeStatsLayout } from './MempoolFeeStats';
import { TransactionTypeFilterTypes } from './TransactionTypeFilterMenu';

const MempoolFeeStatLineSkeleton = () => {
  return (
    <MempoolFeeStatLineLayout
      icon={<SkeletonItem width={'2.5px'} height={'2.5px'} borderRadius={'50%'} />}
      text={<SkeletonItem width={'100px'} height={'10px'} />}
      dotBg={'gray.200'}
    />
  );
};

export const MempoolFeeStatLinesSkeleton = () => {
  return (
    <>
      <MempoolFeeStatLineSkeleton />
      <MempoolFeeStatLineSkeleton />
      <MempoolFeeStatLineSkeleton />
    </>
  );
};

export const MempoolFeePieChartSectionSkeleton = () => {
  return (
    <MempoolFeePieChartSectionLayout
      pieChart={<MempoolFeePieChartSkeleton />}
      statLines={<MempoolFeeStatLinesSkeleton />}
    />
  );
};

export const MempoolFeePieChartSkeleton = () => {
  return (
    <Flex justifyContent="center" alignItems="center" width={pieChartWidth} height={pieChartHeight}>
      <SkeletonCircle width={134} height={134} />
    </Flex>
  );
};

const MempoolFeePriorityCardTransactionTypeFeeStatLinesSkeleton = () => {
  return (
    <>
      <MempoolFeePriorityCardTransactionTypeFeeStatLineLayout
        icon={getTxTypeIcon('token_transfer')}
        fee={<SkeletonItem width={'100px'} height={'10px'} />}
        tooltipContent={null}
      />
      <MempoolFeePriorityCardTransactionTypeFeeStatLineLayout
        icon={getTxTypeIcon('contract_call')}
        fee={<SkeletonItem width={'100px'} height={'10px'} />}
        tooltipContent={null}
      />
      <MempoolFeePriorityCardTransactionTypeFeeStatLineLayout
        icon={getTxTypeIcon('smart_contract')}
        fee={<SkeletonItem width={'100px'} height={'10px'} />}
        tooltipContent={null}
      />
    </>
  );
};

export const MempoolFeePriorityCardSkeleton = ({
  priority,
}: {
  priority: keyof MempoolFeePriorities['all'];
} & FlexProps) => {
  return (
    <MempoolFeePriorityCardLayout
      title={<MempoolFeePriorityCardTitle priority={priority} />}
      mainText={<SkeletonText width={25} height={6} noOfLines={1} />}
      secondaryText={<SkeletonItem width={12} height={5} />}
      txTypeFeeStatLines={<MempoolFeePriorityCardTransactionTypeFeeStatLinesSkeleton />}
    />
  );
};

export const MempoolFeePriorityCardsSkeleton = () => {
  return (
    <>
      <MempoolFeePriorityCardSkeleton priority={'low_priority'} />
      <MempoolFeePriorityCardSkeleton priority={'medium_priority'} />
      <MempoolFeePriorityCardSkeleton priority={'high_priority'} />
    </>
  );
};

export const MempoolFeePriorityCardsSectionSkeleton = () => {
  return (
    <MempoolFeePriorityCardsLayout
      transactionType={TransactionTypeFilterTypes.AverageForAllTransactions}
      setTransactionType={() => {}}
      mempoolFeePriorityCards={<MempoolFeePriorityCardsSkeleton />}
    />
  );
};

export const MempoolFeeStatsSkeleton = () => {
  return (
    <MempoolFeeStatsLayout
      mempoolFeePieChartSection={<MempoolFeePieChartSectionSkeleton />}
      mempoolFeePriorityCardsSection={<MempoolFeePriorityCardsSectionSkeleton />}
    />
  );
};
