import { Section } from '../../../../common/components/Section';
import { Box } from '../../../../ui/Box';
import { Flex } from '../../../../ui/Flex';
import { Grid } from '../../../../ui/Grid';
import { SkeletonText } from '../../../../ui/SkeletonText';
import { BlockPageHeadersSkeleton } from './BlocksPageHeaders';

export function BurnBlockGroupWithTxsSkeleton({
  numTxs,
  index,
}: {
  numTxs: number;
  index: number;
}) {
  return (
    <Box border={'1px'} rounded={'lg'} p={4}>
      <SkeletonText noOfLines={1} height="14px" />
      <Grid templateColumns="repeat(4, 1fr)" gap={4} width={'full'} rowGap={4}>
        {Array.from({ length: 4 }).map((_, colIndex) => (
          <Flex
            bg="hoverBackground"
            px={2.5}
            py={2}
            borderRadius="md"
            justifyContent="center"
            alignItems="center"
            key={`burn-block-group-tx-header-skeleton-${colIndex}`}
          >
            <SkeletonText noOfLines={1} height="14px" />
          </Flex>
        ))}
        {Array.from({ length: numTxs }).map((_, rowIndex) =>
          Array.from({ length: 4 }).map((_, colIndex) => (
            <SkeletonText
              noOfLines={1}
              height="14px"
              key={`burn-block-group-tx-skeleton-${rowIndex}-${colIndex}`}
            />
          ))
        )}
      </Grid>
      <Box borderTop="1px solid var(--stacks-colors-borderPrimary)">
        <SkeletonText noOfLines={1} height="14px" />
      </Box>
    </Box>
  );
}

export function BurnBlockGroupWithoutTxsSkeleton({ index }: { index: number }) {
  return (
    <Box border={'1px'} rounded={'lg'} p={4}>
      <SkeletonText noOfLines={1} height="14px" />
      <Grid templateColumns="repeat(4, 1fr)" gap={4} width={'full'} rowGap={4}>
        {Array.from({ length: 4 }).map((_, rowIndex) => (
          <Flex
            bg="hoverBackground"
            px={2.5}
            py={2}
            borderRadius="md"
            justifyContent="center"
            alignItems="center"
            key={`burn-block-group-tx-header-skeleton-${rowIndex}`}
          >
            <SkeletonText noOfLines={1} height="14px" />
          </Flex>
        ))}
        <Box borderTop="1px solid var(--stacks-colors-borderPrimary)">
          <SkeletonText noOfLines={1} height="14px" />
        </Box>
      </Grid>
    </Box>
  );
}

export function BurnBlockGroupListSkeleton({
  numBurnBlockGroupsWithTxs,
  numTransactionsinBurnBlockGroupWithTxs,
  numBurnBlockGroupsWithoutTxs,
}: {
  numBurnBlockGroupsWithTxs: number;
  numTransactionsinBurnBlockGroupWithTxs: number;
  numBurnBlockGroupsWithoutTxs: number;
}) {
  return (
    <Flex flexDirection="column" gap={4} pt={4} key="burn-block-group-list-skeleton">
      {numBurnBlockGroupsWithTxs
        ? Array.from({ length: numBurnBlockGroupsWithTxs }).map((_, i) => (
            <BurnBlockGroupWithTxsSkeleton
              numTxs={numTransactionsinBurnBlockGroupWithTxs}
              index={i}
              key={`burn-block-group-with-txs-skeleton-${i}`}
            />
          ))
        : null}
      {numBurnBlockGroupsWithoutTxs
        ? Array.from({ length: numBurnBlockGroupsWithoutTxs }).map((_, i) => (
            <BurnBlockGroupWithoutTxsSkeleton
              index={i}
              key={`burn-block-group-without-txs-skeleton-${i}`}
            />
          ))
        : null}
    </Flex>
  );
}

export function HomePageBlockListGroupedByBtcBlockSkeleton() {
  return (
    <Section title={<SkeletonText noOfLines={1} height="14px" />}>
      <BurnBlockGroupListSkeleton
        numBurnBlockGroupsWithTxs={3}
        numTransactionsinBurnBlockGroupWithTxs={3}
        numBurnBlockGroupsWithoutTxs={0}
      />
    </Section>
  );
}

export function BlocksPageBlockListGroupedByBtcBlockSkeleton() {
  return (
    <Section title={<SkeletonText noOfLines={1} height="14px" />}>
      <BlockPageHeadersSkeleton />
      <BurnBlockGroupListSkeleton
        numBurnBlockGroupsWithTxs={1}
        numTransactionsinBurnBlockGroupWithTxs={10}
        numBurnBlockGroupsWithoutTxs={9}
      />
    </Section>
  );
}
