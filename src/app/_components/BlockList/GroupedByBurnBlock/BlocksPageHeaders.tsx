'use client';

import { Card } from '../../../../common/components/Card';
import { Stack } from '../../../../ui/Stack';
import { Text } from '../../../../ui/Text';
import { Flex } from '../../../../ui/Flex';
import { useSuspenseBurnBlocks } from '../../../../common/queries/useBurnBlocks';

function LastBlockCard() {
const lastBlock = useSuspenseBurnBlocks(1)

  return (
    <Stack padding="22px 38px" gap={3} alignItems="flex-start" flexWrap="nowrap">
      <Text fontSize="xs" fontWeight="medium" whiteSpace="nowrap">
        LAST BLOCK
      </Text>
      <Text fontSize="xl" fontWeight="medium" whiteSpace="nowrap" display="inline-block" mr={1}>
        some number
      </Text>
      <Text fontSize="xs" fontWeight="medium" color="secondaryText">
        Some more info
      </Text>
    </Stack>
  );
}

function AverageStacksBlockTimeCard() {
  return (
    <Flex padding="22px 38px" gap={1} alignItems="flex-start" flexWrap="nowrap">
      Nothing yet
    </Flex>
  );
}

function NextStackingCycleCard() {
  return (
    <Flex padding="22px 38px" gap={1} alignItems="flex-start" flexWrap="nowrap">
      Nothing yet
    </Flex>
  );
}

export function BlocksPageHeaderLayout({
  lastBlockCard,
  averageStacksBlockTimeCard,
  nextStackingCycleCard,
}: {
  title: ReactNode;
  lastBlockCard: ReactNode;
  averageStacksBlockTimeCard: ReactNode;
  nextStackingCycleCard: ReactNode;
}) {
  return (
    <Card
      width="full"
      flexDirection="column"
      display="grid"
      gridTemplateColumns={['100%', '100%', '100%', 'repeat(3, 33.33%)']}
      sx={{
        '& > *:not(:last-of-type)': {
          borderBottom: ['1px solid #000', null, null, 'none'], // Apply bottom border on smaller screens
          borderRight: [null, null, null, '1px solid #000'], // Apply right border on larger screens
        },
        '& > *:last-of-type': {
          borderBottom: 'none', // Ensure the last item has no bottom border
          borderRight: 'none', // Ensure the last item has no right border
        },
      }}
    >
      {lastBlockCard}
      {averageStacksBlockTimeCard}
      {nextStackingCycleCard}
    </Card>
  );
}

export function BlocksPageHeaders() {
  return (
    <BlocksPageHeaderLayout
      lastBlockCard={<LastBlockCard />}
      averageStacksBlockTimeCard={<AverageStacksBlockTimeCard />}
      nextStackingCycleCard={<NextStackingCycleCard />}
    />
  );
}
