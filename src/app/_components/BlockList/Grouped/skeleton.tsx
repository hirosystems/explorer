import { useColorModeValue } from '@chakra-ui/react';

import { Circle } from '../../../../common/components/Circle';
import { Box } from '../../../../ui/Box';
import { Button } from '../../../../ui/Button';
import { Flex } from '../../../../ui/Flex';
import { SkeletonItem } from '../../../../ui/SkeletonItem';
import { SkeletonText } from '../../../../ui/SkeletonText';
import { Stack } from '../../../../ui/Stack';
import { Text } from '../../../../ui/Text';
import {
  BlocksPageBlockListLayout,
  BlocksPageControlsLayout,
} from '../BlocksPage/BlocksPageBlockList';
import { BlocksPageHeaderLayout } from '../BlocksPage/BlocksPageHeaders';
import { ControlsLayout } from '../Controls';
import { HomePageBlockListLayout, HomePageControlsLayout } from '../HomePage/HomePageBlockList';
import { BlockListRowSkeleton } from '../Ungrouped/skeleton';
import { UpdateBarLayout } from '../UpdateBar';
import { BurnBlockGroupGridLayout } from './BlockListGrouped';

function BitcoinHeaderSkeleton() {
  return (
    <Box pb={4}>
      <SkeletonText noOfLines={1} width={60} />
    </Box>
  );
}

export function BlockListLoadMoreButtonSkeleton({ ...rest }) {
  return (
    <Box width="full" {...rest}>
      <Button borderTop="1px solid var(--stacks-colors-borderPrimary)" width="full">
        <SkeletonText noOfLines={1} width={60} />
      </Button>
    </Box>
  );
}

export function BurnBlockGroupFooterSkeleton() {
  return (
    <Box borderTop="1px solid var(--stacks-colors-borderSecondary)" pt={4}>
      <SkeletonText noOfLines={1} width={60} />
    </Box>
  );
}

function BlockCountSkeleton() {
  // TODO: remove. use theme
  const bgColor = useColorModeValue('purple.100', 'slate.900');

  return (
    <Flex
      display={'flex'}
      fontSize={'xs'}
      bg={bgColor}
      rounded={'full'}
      px={2}
      alignItems={'center'}
      gap={1}
      height={8}
      width="fit-content"
      mb={3}
    >
      <SkeletonText noOfLines={1} width={20} />
      <Circle height={4.5} width={4.5} bg="surface" />
    </Flex>
  );
}

export function BlockListGridHeaderRowSkeleton() {
  return (
    <>
      {Array.from({ length: 4 }).map((_, colIndex) => (
        <Flex // TODO: get styles from component
          bg="hoverBackground"
          px={2.5}
          py={2}
          borderRadius="md"
          justifyContent="center"
          alignItems="center"
          key={`burn-block-group-tx-header-skeleton-${colIndex}`}
          width={20}
        >
          <SkeletonText noOfLines={1} width={20} />
        </Flex>
      ))}
    </>
  );
}

export function BurnBlockGroupSkeleton({
  numTxs,
  minimized,
}: {
  numTxs: number;
  minimized?: boolean;
}) {
  return (
    <Box border={'1px'} rounded={'lg'} p={4}>
      <BitcoinHeaderSkeleton />
      <BurnBlockGroupGridLayout minimized={minimized}>
        {minimized || numTxs === 0 ? null : <BlockListGridHeaderRowSkeleton />}
        {Array.from({ length: numTxs }).map((_, rowIndex) => (
          <BlockListRowSkeleton
            isFirst={rowIndex === 0}
            isLast={rowIndex === numTxs - 1}
            minimized={minimized}
            key={`block-list-row-skeleton-${rowIndex}`}
          />
        ))}
      </BurnBlockGroupGridLayout>
      <BlockCountSkeleton />
      <BurnBlockGroupFooterSkeleton />
    </Box>
  );
}

export function BurnBlockGroupListSkeleton({
  numBurnBlockGroupsWithTxs,
  numTxsinBurnBlockGroupWithTxs,
  numBurnBlockGroupsWithoutTxs,
  minimized,
}: {
  numBurnBlockGroupsWithTxs: number;
  numTxsinBurnBlockGroupWithTxs: number;
  numBurnBlockGroupsWithoutTxs: number;
  minimized?: boolean;
}) {
  return (
    <Flex flexDirection="column" gap={4} py={6} key="burn-block-group-list-skeleton">
      {numBurnBlockGroupsWithTxs
        ? Array.from({ length: numBurnBlockGroupsWithTxs }).map((_, i) => (
            <BurnBlockGroupSkeleton
              numTxs={numTxsinBurnBlockGroupWithTxs}
              key={`burn-block-group-skeleton-with-txs-${i}`}
              minimized={minimized}
            />
          ))
        : null}
      {numBurnBlockGroupsWithoutTxs
        ? Array.from({ length: numBurnBlockGroupsWithoutTxs }).map((_, i) => (
            <BurnBlockGroupSkeleton
              numTxs={0}
              key={`burn-block-group-skeleton-w/o-txs-${i}`}
              minimized={minimized}
            />
          ))
        : null}
    </Flex>
  );
}

export function HomePageBlockListGroupedSkeleton() {
  return (
    <BurnBlockGroupListSkeleton
      numBurnBlockGroupsWithTxs={3}
      numTxsinBurnBlockGroupWithTxs={3}
      numBurnBlockGroupsWithoutTxs={0}
      minimized={true}
    />
  );
}

export function BlocksPageBlockListGroupedSkeleton() {
  return (
    <BurnBlockGroupListSkeleton
      numBurnBlockGroupsWithTxs={3}
      numTxsinBurnBlockGroupWithTxs={10}
      numBurnBlockGroupsWithoutTxs={0}
    />
  );
}

export function BlockPageHeaderSkeleton() {
  return (
    <Stack py={5} px={9} gap={3} alignItems="flex-start" flexWrap="nowrap" justifyContent="center">
      <Text fontSize="xs" fontWeight="medium" whiteSpace="nowrap">
        <SkeletonText noOfLines={1} height="14px" skeletonHeight="14px" width={80} />
      </Text>
      <Text fontSize="xl" fontWeight="medium" whiteSpace="nowrap" display="inline-block" mr={1}>
        <SkeletonText noOfLines={1} height="14px" skeletonHeight="14px" width={40} />
      </Text>
      <Text fontSize="xs" fontWeight="medium" color="textSubdued">
        <SkeletonText noOfLines={1} height="14px" skeletonHeight="14px" width={80} />
      </Text>
    </Stack>
  );
}

export function BlockPageHeadersSkeleton() {
  return (
    <BlocksPageHeaderLayout
      lastBlockCard={<BlockPageHeaderSkeleton />}
      averageStacksBlockTimeCard={<BlockPageHeaderSkeleton />}
      lastConfirmedBitcoinBlockCard={<BlockPageHeaderSkeleton />}
    />
  );
}

function HomePageControlsSkeleton({ horizontal }: { horizontal?: boolean }) {
  return (
    <HomePageControlsLayout>
      <SkeletonItem height={5} width={'90px'} />
      <ControlsLayout horizontal={horizontal}>
        <SkeletonItem height={5} width={20} />
        <SkeletonItem height={5} width={20} />
      </ControlsLayout>
    </HomePageControlsLayout>
  );
}

function BlocksPageControlsSkeleton({ horizontal }: { horizontal?: boolean }) {
  return (
    <BlocksPageControlsLayout>
      <ControlsLayout horizontal={horizontal} gap={3}>
        <SkeletonItem height={5} width={20} />
        <SkeletonItem height={5} width={20} />
      </ControlsLayout>
    </BlocksPageControlsLayout>
  );
}

export function UpdateBarSkeleton() {
  return (
    <UpdateBarLayout>
      <Flex justifyContent="space-between" alignItems="center" width="full" height={4}>
        <SkeletonItem height={4} width={40} />
        <SkeletonItem height={4} width={40} />
      </Flex>
    </UpdateBarLayout>
  );
}

export function BlocksPageBlockListSkeleton() {
  return (
    <BlocksPageBlockListLayout>
      <BlocksPageControlsSkeleton horizontal />
      <UpdateBarSkeleton />
      <BlocksPageBlockListGroupedSkeleton />
    </BlocksPageBlockListLayout>
  );
}

export function HomePageBlockListSkeleton() {
  return (
    <HomePageBlockListLayout>
      <HomePageControlsSkeleton />
      <UpdateBarSkeleton />
      <HomePageBlockListGroupedSkeleton />
    </HomePageBlockListLayout>
  );
}
