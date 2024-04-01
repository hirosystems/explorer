import { Section } from '../../../../common/components/Section';
import { Box } from '../../../../ui/Box';
import { Flex } from '../../../../ui/Flex';
import { Grid } from '../../../../ui/Grid';
import { SkeletonText } from '../../../../ui/SkeletonText';
import { BlockPageHeadersSkeleton } from './BlocksPageHeaders';

export function BurnBlockGroupWithTransactionsSkeleton({ numTxs }: { numTxs: number }) {
  return (
    <Box border={'1px'} rounded={'lg'} p={4}>
      <SkeletonText noOfLines={1} height="14px" />
      <Grid templateColumns="repeat(4, 1fr)" gap={4} width={'full'} rowGap={4}>
        {Array.from({ length: 4 }).map(() => (
          <Flex
            bg="hoverBackground"
            px={2.5}
            py={2}
            borderRadius="md"
            justifyContent="center"
            alignItems="center"
          >
            <SkeletonText noOfLines={1} height="14px" />
          </Flex>
        ))}
        {Array.from({ length: numTxs }).map(() =>
          Array.from({ length: 4 }).map(() => <SkeletonText noOfLines={1} height="14px" />)
        )}
      </Grid>
      <Box borderTop="1px solid var(--stacks-colors-borderPrimary)">
        <SkeletonText noOfLines={1} height="14px" />
      </Box>
    </Box>
  );
}

export function BurnBlockGroupWithoutTransactionsSkeleton() {
  return (
    <Box border={'1px'} rounded={'lg'} p={4}>
      <SkeletonText noOfLines={1} height="14px" />
      <Grid templateColumns="repeat(4, 1fr)" gap={4} width={'full'} rowGap={4}>
        {Array.from({ length: 4 }).map(() => (
          <Flex
            bg="hoverBackground"
            px={2.5}
            py={2}
            borderRadius="md"
            justifyContent="center"
            alignItems="center"
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
    <Flex flexDirection="column" gap={4} pt={4}>
      {numBurnBlockGroupsWithTxs
        ? Array.from({ length: numBurnBlockGroupsWithTxs }).map(() => (
            <BurnBlockGroupWithTransactionsSkeleton
              numTxs={numTransactionsinBurnBlockGroupWithTxs}
            />
          ))
        : null}
      {numBurnBlockGroupsWithoutTxs
        ? Array.from({ length: numBurnBlockGroupsWithoutTxs }).map(() => (
            <BurnBlockGroupWithoutTransactionsSkeleton />
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
