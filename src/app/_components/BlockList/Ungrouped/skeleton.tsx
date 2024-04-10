import { Stack } from '@/ui/Stack';

import { Circle } from '../../../../common/components/Circle';
import { Flex } from '../../../../ui/Flex';
import { SkeletonText } from '../../../../ui/SkeletonText';
import { StxBlockListItemLayout } from './BlockListUngrouped';
import { BtcBlockListItemLayout } from './BtcBlockListItem';

function StxBlockListItemContentSkeleton({ hasIcon }: { hasIcon: boolean }) {
  return (
    <>
      <Flex alignItems="center">
        {hasIcon && <Circle height={4.5} width={4.5} ml={-6} mr={2} bg="brand" border="none" />}
        <SkeletonText noOfLines={1} width={20} />
      </Flex>
      <SkeletonText noOfLines={1} width={20} />
    </>
  );
}
function StxBlockListItemSkeleton({
  hasIcon,
  hasBorder,
}: {
  hasIcon: boolean;
  hasBorder: boolean;
}) {
  return (
    <StxBlockListItemLayout hasIcon={hasIcon} hasBorder={hasBorder}>
      <StxBlockListItemContentSkeleton hasIcon={hasIcon} />
    </StxBlockListItemLayout>
  );
}

export function StxBlockListSkeleton({ numBlocks }: { numBlocks: number }) {
  return (
    <>
      {Array.from({ length: numBlocks }).map((_, i) => (
        <StxBlockListItemSkeleton
          hasIcon={i === 0}
          hasBorder={i < numBlocks - 1}
          key={`stx-block-list-item-skeleton-${i}`}
        />
      ))}
    </>
  );
}

function BtcBlockListItemContentSkeleton() {
  return (
    <>
      <SkeletonText noOfLines={1} width={20} />
      <SkeletonText noOfLines={1} width={20} />
    </>
  );
}

function BtcBlockListItemSkeleton() {
  return (
    <BtcBlockListItemLayout>
      <BtcBlockListItemContentSkeleton />
    </BtcBlockListItemLayout>
  );
}

export function BlocksPageBlockListUngroupedSkeleton() {
  return (
    <Stack pl={4} pr={2} gap={0} width={'full'}>
      <StxBlockListSkeleton numBlocks={10} />
      <BtcBlockListItemSkeleton />
      <StxBlockListSkeleton numBlocks={30} />
      <BtcBlockListItemSkeleton />
    </Stack>
  );
}

export function HomePageBlockListUngroupedSkeleton() {
  return <></>;
}
