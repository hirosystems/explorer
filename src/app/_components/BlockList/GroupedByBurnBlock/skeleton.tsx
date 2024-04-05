import { SkeletonCircle, useColorModeValue } from '@chakra-ui/react';

import { Section } from '../../../../common/components/Section';
import { Box } from '../../../../ui/Box';
import { Flex } from '../../../../ui/Flex';
import { Grid } from '../../../../ui/Grid';
import { SkeletonText } from '../../../../ui/SkeletonText';

function BitcoinHeaderSkeleton() {
  return (
    <Box pb={4}>
      <SkeletonText noOfLines={1} width={60} />
    </Box>
  );
}

function FooterSkeleton() {
  return (
    <Box pt={4} borderTop="1px solid var(--stacks-colors-borderPrimary)">
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
      <SkeletonCircle height={4.5} width={4.5} bg="surface" />
    </Flex>
  );
}

function GridHeaderRowSkeleton() {
  return (
    <>
      {Array.from({ length: 4 }).map((_, colIndex) => (
        <Flex
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

function GridRowSkeleton({ numTxs }: { numTxs: number }) {
  if (numTxs === 0) {
    return null;
  }
  return (
    <>
      {Array.from({ length: numTxs }).map((_, rowIndex) =>
        Array.from({ length: 4 }).map((_, colIndex) => (
          <SkeletonText
            noOfLines={1}
            key={`burn-block-group-tx-skeleton-${rowIndex}-${colIndex}`}
          />
        ))
      )}
    </>
  );
}

export function BurnBlockGroupSkeleton({ numTxs }: { numTxs: number }) {
  return (
    <Box border={'1px'} rounded={'lg'} p={4}>
      <BitcoinHeaderSkeleton />
      <Grid templateColumns="repeat(4, 1fr)" gap={4} width={'full'} rowGap={4} pb={2}>
        <GridHeaderRowSkeleton />
        <GridRowSkeleton numTxs={numTxs} />
      </Grid>
      <BlockCountSkeleton />
      <FooterSkeleton />
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
    <Flex flexDirection="column" gap={4} py={6} key="burn-block-group-list-skeleton">
      {numBurnBlockGroupsWithTxs
        ? Array.from({ length: numBurnBlockGroupsWithTxs }).map((_, i) => (
            <BurnBlockGroupSkeleton
              numTxs={numTransactionsinBurnBlockGroupWithTxs}
              key={`burn-block-group-skeleton-${i}`}
            />
          ))
        : null}
      {numBurnBlockGroupsWithoutTxs
        ? Array.from({ length: numBurnBlockGroupsWithoutTxs }).map((_, i) => (
            <BurnBlockGroupSkeleton numTxs={0} key={`burn-block-group-skeleton-${i}`} />
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
    <BurnBlockGroupListSkeleton
      numBurnBlockGroupsWithTxs={1}
      numTransactionsinBurnBlockGroupWithTxs={10}
      numBurnBlockGroupsWithoutTxs={9}
    />
  );
}
