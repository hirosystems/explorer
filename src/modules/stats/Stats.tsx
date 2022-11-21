import { FC, ReactNode, useMemo } from 'react';
import * as React from 'react';
import { Box, color, Text, Flex } from '@stacks/ui';
import { Tooltip } from '@components/tooltip';
import { Card } from '@components/card';
import { css } from '@emotion/react';
import { MICROSTACKS_IN_STACKS, numberToString, usdFormatterNoDecimals } from '@common/utils';
import { TiArrowSortedUp, TiArrowSortedDown } from 'react-icons/ti';
import { useQuery } from 'react-query';
import { useApi } from '@common/api/client';
import { useAppSelector } from '@common/state/hooks';
import { selectActiveNetworkUrl } from '@common/state/network-slice';
import { DEFAULT_LIST_LIMIT } from '@common/constants';
import { useBlockList } from '@features/blocks-list/useBlockList';
import { FaBitcoin } from 'react-icons/fa';
import { Circle } from '@components/circle';
import { ExplorerSkeletonLoader } from '@components/loaders/skeleton-common';
import { InfoCircleIcon } from '@components/icons/info-circle';

const statSectionStyle = css`
  display: grid;
  border-right: 1px solid var(--colors-border);
  padding: 24px;
  height: 131px;
  &:last-child {
    border-right: none;
  }
`;

const StatSection: FC<{
  title: ReactNode;
  bodyMainText: ReactNode;
  bodySecondaryText: ReactNode;
  caption: ReactNode;
}> = ({ title, bodyMainText, bodySecondaryText, caption }) => (
  <Box css={statSectionStyle}>
    <Text color={color('text-title')} fontWeight="500" mb={'9px'} style={{ whiteSpace: 'nowrap' }}>
      {title}
    </Text>
    <Flex
      fontSize={'27px'}
      mb={'6px'}
      color={color('text-title')}
      alignItems={'baseline'}
      wrap={'nowrap'}
    >
      <Text fontSize={'27px'} mr={'6px'} style={{ whiteSpace: 'nowrap' }}>
        {bodyMainText}{' '}
      </Text>
      <Text fontSize={'14px'} style={{ whiteSpace: 'nowrap' }}>
        {bodySecondaryText}
      </Text>
    </Flex>
    {caption}
  </Box>
);

const MovePercentage: FC<{ currentValue: number; previousValue: number }> = ({
  currentValue,
  previousValue,
}) => {
  const moveAmount = currentValue - previousValue;
  const isUp = moveAmount >= 0;
  const Icons = isUp ? TiArrowSortedUp : TiArrowSortedDown;
  const color = isUp ? '#16C784' : '#EA3943';
  const movePercentage = Math.abs((moveAmount * 100) / previousValue).toFixed(2);
  return (
    <Flex alignItems={'center'} color={color}>
      (
      <Icons size={18} />
      {movePercentage}%)
    </Flex>
  );
};

const SkeletonStatSection: FC = () => (
  // TODO: Add error state once we have a design for it
  <StatSection
    title={<ExplorerSkeletonLoader width={'75%'} />}
    bodyMainText={<ExplorerSkeletonLoader width={'80px'} />}
    bodySecondaryText={<ExplorerSkeletonLoader width={'60px'} />}
    caption={<ExplorerSkeletonLoader width={'90%'} />}
  />
);

const StxSupply: FC<{ unlockedStx?: string; totalStx?: string; unlockedPercent?: string }> = ({
  unlockedStx,
  totalStx,
  unlockedPercent,
}) => {
  if (!unlockedStx || !totalStx || !unlockedPercent) {
    return <SkeletonStatSection />;
  }
  return (
    <StatSection
      title="STX Supply"
      bodyMainText={numberToString(unlockedStx ? Number(unlockedStx) : 0)}
      bodySecondaryText={`/ ${numberToString(totalStx ? Number(totalStx) : 0)}`}
      caption={
        <Flex fontSize={'12px'} color={color('text-title')} fontWeight="500" alignItems={'center'}>
          {Number(unlockedPercent || 0).toFixed(2)}%&nbsp;
          <Text fontSize={'12px'} color={color('text-caption')}>
            {' '}
            is unlocked
          </Text>
        </Flex>
      }
    />
  );
};

const MarketCap: FC<{
  marketCapToday?: number;
  marketCapYesterday?: number;
  totalVolumeToday?: number;
  totalVolumeYesterday?: number;
}> = ({ marketCapToday, marketCapYesterday, totalVolumeToday, totalVolumeYesterday }) => {
  if (!marketCapToday || !marketCapYesterday || !totalVolumeToday || !totalVolumeYesterday) {
    return <SkeletonStatSection />;
  }
  return (
    <StatSection
      title="Market Cap"
      bodyMainText={usdFormatterNoDecimals.format(marketCapToday)}
      bodySecondaryText={
        <MovePercentage currentValue={marketCapToday} previousValue={marketCapYesterday} />
      }
      caption={
        <Flex fontSize={'12px'} color={color('text-title')} fontWeight="500" alignItems={'center'}>
          <Text fontSize={'12px'} color={color('text-caption')}>
            24h volume:
          </Text>
          &nbsp;
          {usdFormatterNoDecimals.format(totalVolumeToday)}&nbsp;
          <MovePercentage currentValue={totalVolumeToday} previousValue={totalVolumeYesterday} />
        </Flex>
      }
    />
  );
};

const StackingCycle: FC<{
  title: string;
  stackedSTX?: number;
  blocksTilNextCycle?: number;
  caption: ReactNode;
}> = ({ title, stackedSTX, blocksTilNextCycle, caption }) => {
  if (!stackedSTX || !blocksTilNextCycle) {
    return <SkeletonStatSection />;
  }
  return (
    <StatSection
      title={title}
      bodyMainText={numberToString(stackedSTX)}
      bodySecondaryText=" STX stacked"
      caption={caption}
    />
  );
};

const LastBlock: FC<{
  lastBlockHeight?: number;
  lastBurnBlockHeight?: number;
  lastBlockTxsCount?: number;
}> = ({ lastBlockHeight, lastBurnBlockHeight, lastBlockTxsCount = 0 }) => {
  if (!lastBlockTxsCount || !lastBurnBlockHeight) {
    return <SkeletonStatSection />;
  }
  return (
    <StatSection
      title="Last Block"
      bodyMainText={`#${lastBlockHeight}`}
      bodySecondaryText={
        <Flex alignItems={'center'}>
          <Circle size={18} mr={'3px'}>
            <FaBitcoin color={color('icon')} size={18} />
          </Circle>
          {lastBurnBlockHeight}
        </Flex>
      }
      caption={
        <Text fontSize={'12px'} color={color('text-caption')} fontWeight="500">
          <Text color={color('text-title')}>{lastBlockTxsCount}</Text> transaction
          {lastBlockTxsCount !== 1 ? 's' : ''}
        </Text>
      }
    />
  );
};

export const Stats: FC = () => {
  const { infoApi } = useApi();
  const activeNetworkUrl = useAppSelector(selectActiveNetworkUrl);
  const { data: stxSupplyData } = useQuery('stx-supply', () => infoApi.getStxSupply({}), {
    staleTime: 30 * 60 * 1000,
  });
  const { data: poxData } = useQuery(
    'pox-info-raw',
    () => fetch(`${activeNetworkUrl}/v2/pox`).then(res => res.json()),
    {
      staleTime: 30 * 60 * 1000,
    }
  );
  const { blocks } = useBlockList(DEFAULT_LIST_LIMIT);
  const { total_stx, unlocked_stx, unlocked_percent } = stxSupplyData || {};
  const { current_cycle, next_cycle, next_reward_cycle_in } = poxData || {};
  const currentCycleStackedSTX = (current_cycle?.stacked_ustx || 0) / MICROSTACKS_IN_STACKS;
  const nextCycleStackedSTX = (next_cycle?.stacked_ustx || 0) / MICROSTACKS_IN_STACKS;
  const blocksTilNextCycle = next_reward_cycle_in || 0;
  const blocksTilNextCyclePreparePhase = next_cycle?.blocks_until_prepare_phase || 0;
  const blocksTilNextCycleRewardPhase = next_cycle?.blocks_until_reward_phase || 0;
  const lastBlockHeight = blocks?.pages?.[0]?.results?.[0]?.height;
  const lastBurnBlockHeight = blocks?.pages?.[0]?.results?.[0]?.burn_block_height;
  const lastBlockTxsCount = blocks?.pages?.[0]?.results?.[0]?.txs?.length;
  const numberOfTenMinutesInDay = (24 * 60) / 10;
  const approximateDaysTilNextCycle = Math.floor(blocksTilNextCycle / numberOfTenMinutesInDay);
  const approximateDaysTilNextCyclePreparePhase = Math.floor(
    blocksTilNextCyclePreparePhase / numberOfTenMinutesInDay
  );
  const approximateDaysTilNextCycleRewardPhase = Math.floor(
    blocksTilNextCycleRewardPhase / numberOfTenMinutesInDay
  );
  const displayPreparePhaseInfo = approximateDaysTilNextCyclePreparePhase > 0;
  const currentCycleCaption = useMemo(
    () => (
      <Flex fontSize={'12px'} color={color('text-title')} fontWeight="500" alignItems={'center'}>
        <Text fontSize={'12px'} color={color('text-caption')}>
          Next cycle starts in
        </Text>
        &nbsp;
        <Tooltip
          label={`Next cycle starts in ${blocksTilNextCycle} block${
            blocksTilNextCycle !== 1 ? 's' : ''
          }. Calculation is based on ~10 minutes block time.`}
        >
          <Flex alignItems={'center'}>
            {approximateDaysTilNextCycle} day{approximateDaysTilNextCycle !== 1 ? 's' : ''}
            &nbsp;
            <InfoCircleIcon size="18px" />
          </Flex>
        </Tooltip>
      </Flex>
    ),
    [approximateDaysTilNextCycle, blocksTilNextCycle]
  );
  const nextCycleCaption = useMemo(
    () => (
      <Flex fontSize={'12px'} color={color('text-title')} fontWeight="500" alignItems={'center'}>
        <Text fontSize={'12px'} color={color('text-caption')}>
          {displayPreparePhaseInfo ? 'Prepare' : 'Reward'} phase starts in
        </Text>
        &nbsp;
        <Tooltip
          label={`Next cycle starts in ${
            displayPreparePhaseInfo ? blocksTilNextCyclePreparePhase : blocksTilNextCycleRewardPhase
          } block${
            (displayPreparePhaseInfo
              ? blocksTilNextCyclePreparePhase
              : blocksTilNextCycleRewardPhase) !== 1
              ? 's'
              : ''
          }. Calculation is based on ~10 minutes block time.`}
        >
          <Flex alignItems={'center'}>
            {displayPreparePhaseInfo
              ? approximateDaysTilNextCyclePreparePhase
              : approximateDaysTilNextCycleRewardPhase}{' '}
            day
            {(displayPreparePhaseInfo
              ? approximateDaysTilNextCyclePreparePhase
              : approximateDaysTilNextCycleRewardPhase) !== 1
              ? 's'
              : ''}
            &nbsp;
            <InfoCircleIcon size="18px" />
          </Flex>
        </Tooltip>
      </Flex>
    ),
    [approximateDaysTilNextCycle, blocksTilNextCycle]
  );
  return (
    <Card
      bg={color('bg')}
      boxShadow="low"
      display={'grid'}
      gridColumnStart={'1'}
      gridColumnEnd={['2', '2', '3']}
      gridTemplateColumns={['100%', '100%', '1fr 1fr', '1fr 1fr 1fr 1fr']}
    >
      <StxSupply
        unlockedStx={unlocked_stx}
        totalStx={total_stx}
        unlockedPercent={unlocked_percent}
      />
      <LastBlock
        lastBlockHeight={lastBlockHeight}
        lastBurnBlockHeight={lastBurnBlockHeight}
        lastBlockTxsCount={lastBlockTxsCount}
      />
      <StackingCycle
        title="Current Stacking Cycle"
        stackedSTX={currentCycleStackedSTX}
        blocksTilNextCycle={blocksTilNextCycle}
        caption={currentCycleCaption}
      />
      <StackingCycle
        title="Next Stacking Cycle"
        stackedSTX={nextCycleStackedSTX}
        blocksTilNextCycle={blocksTilNextCycle}
        caption={nextCycleCaption}
      />
    </Card>
  );
};
