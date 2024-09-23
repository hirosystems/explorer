'use client';

import { ReactNode, Suspense } from 'react';

import { BurnBlock, NakamotoBlock } from '@stacks/blockchain-api-client';

import { Card } from '../../../../common/components/Card';
import { useSuspenseInfiniteQueryResult } from '../../../../common/hooks/useInfiniteQueryResult';
import { useRenderNewBlockList } from '../../../../common/hooks/useIsNakamoto';
import { useSuspenseBlocksByBurnBlock } from '../../../../common/queries/useBlocksByBurnBlock';
import { useSuspenseBurnBlocks } from '../../../../common/queries/useBurnBlocksInfinite';
import { Flex } from '../../../../ui/Flex';
import { Icon } from '../../../../ui/Icon';
import { Stack } from '../../../../ui/Stack';
import { Text } from '../../../../ui/Text';
import BitcoinIcon from '../../../../ui/icons/BitcoinIcon';
import { BlockPageHeadersSkeleton } from '../Grouped/skeleton';
import { useSuspenseAverageBlockTimes } from '../data/useAverageBlockTimes';

function LastBlockCard() {
  const burnBlockResponse = useSuspenseBurnBlocks(1);
  const burnBlocks = useSuspenseInfiniteQueryResult<BurnBlock>(burnBlockResponse);
  const btcBlock = burnBlocks[0];
  const stxBlockResponse = useSuspenseBlocksByBurnBlock(btcBlock.burn_block_height, 1);
  const stxBlocks = useSuspenseInfiniteQueryResult<NakamotoBlock>(stxBlockResponse, 1);
  const lastStxBlock = stxBlocks[0];
  return (
    <Stack py={5} px={9} gap={3} alignItems="flex-start" flexWrap="nowrap">
      <Text fontSize="xs" fontWeight="medium" whiteSpace="nowrap">
        LAST BLOCK
      </Text>
      <Flex alignItems="center" gap={2}>
        <Text fontSize="xl" fontWeight="medium" whiteSpace="nowrap" display="inline-block" mr={1}>
          #{lastStxBlock.height}
        </Text>
        <Flex alignItems="center" gap={1}>
          <Icon as={BitcoinIcon} size={4.5} />
          <Text
            fontSize="xl"
            fontWeight="medium"
            whiteSpace="nowrap"
            display="inline-block"
            mr={1}
            color="textSubdued"
          >
            #{btcBlock.burn_block_height}
          </Text>
        </Flex>
      </Flex>
      <Text fontSize="xs" fontWeight="medium" color="textSubdued">
        {btcBlock.stacks_blocks.length} transactions
      </Text>
    </Stack>
  );
}

function AverageStacksBlockTimeCard() {
  const {
    data: { last_24h },
  } = useSuspenseAverageBlockTimes();

  return (
    <Stack py={5} px={9} gap={3} alignItems="flex-start" flexWrap="nowrap">
      <Text fontSize="xs" fontWeight="medium" whiteSpace="nowrap">
        AVERAGE STACKS BLOCK TIME
      </Text>
      <Text fontSize="xl" fontWeight="medium" whiteSpace="nowrap" display="inline-block" mr={1}>
        {last_24h} sec.
      </Text>
      <Text fontSize="xs" fontWeight="medium" color="textSubdued">
        In the last 24hs.
      </Text>
    </Stack>
  );
}

function LastConfirmedBitcoinBlockCard() {
  const response = useSuspenseBurnBlocks(2);
  const burnBlocks = useSuspenseInfiniteQueryResult<BurnBlock>(response);
  const btcBlock = burnBlocks[1];
  return (
    <Stack py={5} px={9} gap={3} alignItems="flex-start" flexWrap="nowrap">
      <Text fontSize="xs" fontWeight="medium" whiteSpace="nowrap" textTransform={'uppercase'}>
        In the previous bitcoin block
      </Text>
      <Flex width="full" display="grid" gridTemplateColumns={['repeat(2, 50%)']}>
        <Stack gap={2}>
          <Text fontSize="xl" fontWeight="medium" whiteSpace="nowrap" display="inline-block" mr={1}>
            {btcBlock.stacks_blocks.length}
          </Text>
          <Text fontSize="xs" fontWeight="medium" color="textSubdued">
            Stacks blocks
          </Text>
        </Stack>
        <Stack gap={2}>
          <Text fontSize="xl" fontWeight="medium" whiteSpace="nowrap" display="inline-block" mr={1}>
            {btcBlock.total_tx_count}
          </Text>
          <Text fontSize="xs" fontWeight="medium" color="textSubdued">
            Stacks transactions
          </Text>
        </Stack>
      </Flex>
    </Stack>
  );
}

export function BlocksPageHeaderLayout({
  lastBlockCard,
  averageStacksBlockTimeCard,
  lastConfirmedBitcoinBlockCard,
  ...rest
}: {
  lastBlockCard: ReactNode;
  averageStacksBlockTimeCard: ReactNode;
  lastConfirmedBitcoinBlockCard: ReactNode;
} & React.ComponentProps<typeof Card>) {
  const renderNewBlockList = useRenderNewBlockList();
  if (renderNewBlockList) {
    return null;
  }
  return (
    <Card
      width="full"
      flexDirection="column"
      display="grid"
      gridTemplateColumns={['100%', '100%', '100%', 'repeat(3, 33.33%)']}
      sx={{
        '& > *:not(:last-of-type)': {
          borderBottom: ['1px solid var(--stacks-colors-borderPrimary)', null, null, 'none'],
          borderRight: [null, null, null, '1px solid var(--stacks-colors-borderPrimary)'],
        },
        '& > *:last-of-type': {
          borderBottom: 'none',
          borderRight: 'none',
        },
      }}
      {...rest}
    >
      {lastBlockCard}
      {averageStacksBlockTimeCard}
      {lastConfirmedBitcoinBlockCard}
    </Card>
  );
}

export function BlocksPageHeaders() {
  return (
    <Suspense fallback={<BlockPageHeadersSkeleton />}>
      <BlocksPageHeaderLayout
        lastBlockCard={<LastBlockCard />}
        averageStacksBlockTimeCard={<AverageStacksBlockTimeCard />}
        lastConfirmedBitcoinBlockCard={<LastConfirmedBitcoinBlockCard />}
      />
    </Suspense>
  );
}
