import { Stack } from '@/ui/Stack';
import { ReactNode } from 'react';

import { Box } from '../../../../ui/Box';
import { Flex } from '../../../../ui/Flex';
import { HStack } from '../../../../ui/HStack';
import { Icon } from '../../../../ui/Icon';
import { SkeletonText } from '../../../../ui/SkeletonText';
import { StxIcon } from '../../../../ui/icons';
import { BlockListGridHeaderRowSkeleton } from '../Grouped/skeleton';
import { LineAndNode } from '../LineAndNode';
import { BtcBlockRowLayout, StxBlocksGridLayout } from './BlockListUngrouped';

// layout was copied
export function BlockListRowSkeleton({
  icon,
  minimized,
}: {
  icon?: ReactNode;
  minimized?: boolean;
}) {
  return minimized ? (
    <>
      <Flex alignItems="center" gridColumn="1 / 2" gap={2}>
        <LineAndNode rowHeight={14} width={6} icon={icon} />
        <SkeletonText noOfLines={1} width={20} />
      </Flex>

      <HStack
        divider={<>&nbsp;∙&nbsp;</>}
        gap={1}
        whiteSpace="nowrap"
        color="textSubdued"
        gridColumn="3 / 4"
      >
        <SkeletonText noOfLines={1} width={10} />
        <SkeletonText noOfLines={1} width={10} />
        <SkeletonText noOfLines={1} width={10} />
      </HStack>
    </>
  ) : (
    <>
      <Flex alignItems="center">
        <LineAndNode rowHeight={14} width={6} icon={icon} />
        <SkeletonText noOfLines={1} width={20} />
      </Flex>

      <Flex alignItems="center">
        <SkeletonText noOfLines={1} width={20} />
      </Flex>

      <Flex alignItems="center">
        <SkeletonText noOfLines={1} width={20} />
      </Flex>

      <Flex alignItems="center">
        <SkeletonText noOfLines={1} width={20} />
      </Flex>
    </>
  );
}

export function StxBlocksGridSkeleton({
  numBlocks,
  minimized,
}: {
  numBlocks: number;
  minimized?: boolean;
}) {
  return (
    <StxBlocksGridLayout minimized={minimized}>
      {minimized ? null : <BlockListGridHeaderRowSkeleton />}
      {Array.from({ length: numBlocks }).map((_, i) => (
        <>
          <BlockListRowSkeleton
            icon={i === 0 ? <Icon as={StxIcon} size={2.5} color={'white'} /> : undefined}
            minimized={minimized}
            key={`block-list-row-skeleton-${i}`}
          />
          {i < numBlocks - 1 && (
            <Box
              key={`block-list-row-border-bottom-${i}`}
              gridColumn={'1/5'}
              borderBottom={'1px'}
              borderColor="borderSecondary"
            ></Box>
          )}
        </>
      ))}
    </StxBlocksGridLayout>
  );
}

function BtcBlockRowContentSkeleton() {
  return (
    <>
      <SkeletonText noOfLines={1} width={20} />
      <SkeletonText noOfLines={1} width={20} />
    </>
  );
}

function BtcBlockRowSkeleton({ minimized }: { minimized?: boolean }) {
  return (
    <BtcBlockRowLayout mx={minimized ? 'unset' : -12}>
      <BtcBlockRowContentSkeleton />
    </BtcBlockRowLayout>
  );
}

export function BlocksPageBlockListUngroupedSkeleton() {
  return (
    <Stack px={6} gap={0} width={'full'}>
      <StxBlocksGridSkeleton numBlocks={10} />
      <BtcBlockRowSkeleton />
      <StxBlocksGridSkeleton numBlocks={30} />
      <BtcBlockRowSkeleton />
    </Stack>
  );
}

export function HomePageBlockListUngroupedSkeleton() {
  return (
    <Stack px={6} gap={0} width={'full'}>
      <StxBlocksGridSkeleton numBlocks={5} minimized={true} />
      <BtcBlockRowSkeleton minimized={true} />
      <StxBlocksGridSkeleton numBlocks={5} minimized={true} />
      <BtcBlockRowSkeleton minimized={true} />
      <StxBlocksGridSkeleton numBlocks={5} minimized={true} />
      <BtcBlockRowSkeleton minimized={true} />
    </Stack>
  );
}
