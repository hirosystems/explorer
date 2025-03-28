import { Box, Flex, Stack } from '@chakra-ui/react';

import { SkeletonText } from '../../../..//components/ui/skeleton';
import { Skeleton } from '../../../../components/ui/skeleton';
import { Button } from '../../../../ui/Button';
import {
  BlocksPageBlockListLayout,
  BlocksPageControlsLayout,
} from '../BlocksPage/BlocksPageBlockList';
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
      <Button borderTop="1px solid var(--stacks-colors-border-primary)" width="full">
        <SkeletonText noOfLines={1} width={60} />
      </Button>
    </Box>
  );
}

export function BurnBlockGroupFooterSkeleton() {
  return (
    <Box borderTop="1px solid var(--stacks-colors-border-secondary)" pt={4}>
      <SkeletonText noOfLines={1} width={60} />
    </Box>
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
          w="fit-content"
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
    <Box border="normal" rounded={'lg'} p={4}>
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
    <Stack gap={4} py={6} key="burn-block-group-list-skeleton">
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
    </Stack>
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

function HomePageControlsSkeleton({ horizontal }: { horizontal?: boolean }) {
  return (
    <HomePageControlsLayout>
      <Skeleton height={5} width={'90px'} />
      <ControlsLayout horizontal={horizontal}>
        <Skeleton height={5} width={20} />
        <Skeleton height={5} width={20} />
      </ControlsLayout>
    </HomePageControlsLayout>
  );
}

function BlocksPageControlsSkeleton({ horizontal }: { horizontal?: boolean }) {
  return (
    <BlocksPageControlsLayout>
      <ControlsLayout horizontal={horizontal} gap={3}>
        <Skeleton height={5} width={20} />
        <Skeleton height={5} width={20} />
      </ControlsLayout>
    </BlocksPageControlsLayout>
  );
}

export function UpdateBarSkeleton() {
  return (
    <UpdateBarLayout>
      <Flex justifyContent="space-between" alignItems="center" width="full" height={4}>
        <Skeleton height={4} width={40} />
        <Skeleton height={4} width={40} />
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
