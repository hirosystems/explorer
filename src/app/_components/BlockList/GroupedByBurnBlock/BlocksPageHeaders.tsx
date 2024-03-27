'use client';

import { ReactNode } from 'react';

import { Card } from '../../../../common/components/Card';
import { useSuspenseBurnBlocks } from '../../../../common/queries/useBurnBlocks';
import { Flex } from '../../../../ui/Flex';
import { Icon } from '../../../../ui/Icon';
import { Stack } from '../../../../ui/Stack';
import { Text } from '../../../../ui/Text';
import { BitcoinIcon } from '../../../../ui/icons/BitcoinIcon';

function LastBlockCard() {
  const lastBlock = useSuspenseBurnBlocks(1); // TODO: might need to use web socket here

  return (
    <Stack padding="22px 38px" gap={3} alignItems="flex-start" flexWrap="nowrap">
      <Text fontSize="xs" fontWeight="medium" whiteSpace="nowrap">
        LAST BLOCK
      </Text>
      <Flex alignItems="center" gap={2}>
        <Text fontSize="xl" fontWeight="medium" whiteSpace="nowrap" display="inline-block" mr={1}>
          #124009
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
            #889300
          </Text>
        </Flex>
      </Flex>
      <Text fontSize="xs" fontWeight="medium" color="textSubdued">
        435 transactions
      </Text>
    </Stack>
  );
}

function AverageStacksBlockTimeCard() {
  return (
    <Stack padding="22px 38px" gap={3} alignItems="flex-start" flexWrap="nowrap">
      <Text fontSize="xs" fontWeight="medium" whiteSpace="nowrap">
        AVERAGE STACKS BLOCK TIME
      </Text>
      <Text fontSize="xl" fontWeight="medium" whiteSpace="nowrap" display="inline-block" mr={1}>
        48 sec.
      </Text>
      <Text fontSize="xs" fontWeight="medium" color="textSubdued">
        In the last 24hs.
      </Text>
    </Stack>
  );
}

function LastConfirmedBitcoinBlockCard() {
  return (
    <Stack padding="22px 38px" gap={3} alignItems="flex-start" flexWrap="nowrap">
      <Text fontSize="xs" fontWeight="medium" whiteSpace="nowrap">
        IN THE LAST CONFIRMED BITCOIN BLOCK
      </Text>
      <Flex width="full" display="grid" gridTemplateColumns={['repeat(2, 50%)']}>
        <Stack gap={2}>
          <Text fontSize="xl" fontWeight="medium" whiteSpace="nowrap" display="inline-block" mr={1}>
            214
          </Text>
          <Text fontSize="xs" fontWeight="medium" color="textSubdued">
            Stacks blocks
          </Text>
        </Stack>
        <Stack gap={2}>
          <Text fontSize="xl" fontWeight="medium" whiteSpace="nowrap" display="inline-block" mr={1}>
            4354
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
}: {
  lastBlockCard: ReactNode;
  averageStacksBlockTimeCard: ReactNode;
  lastConfirmedBitcoinBlockCard: ReactNode;
}) {
  return (
    <Card
      width="full"
      flexDirection="column"
      display="grid"
      gridTemplateColumns={['100%', '100%', '100%', 'repeat(3, 33.33%)']}
      sx={{
        '& > *:not(:last-of-type)': {
          borderBottom: ['1px solid var(--stacks-colors-borderPrimary)', null, null, 'none'], // Apply bottom border on smaller screens
          borderRight: [null, null, null, '1px solid var(--stacks-colors-borderPrimary)'], // Apply right border on larger screens
        },
        '& > *:last-of-type': {
          borderBottom: 'none', // Ensure the last item has no bottom border
          borderRight: 'none', // Ensure the last item has no right border
        },
      }}
    >
      {lastBlockCard}
      {averageStacksBlockTimeCard}
      {lastConfirmedBitcoinBlockCard}
    </Card>
  );
}

export function BlocksPageHeaders() {
  return (
    <BlocksPageHeaderLayout
      lastBlockCard={<LastBlockCard />}
      averageStacksBlockTimeCard={<AverageStacksBlockTimeCard />}
      lastConfirmedBitcoinBlockCard={<LastConfirmedBitcoinBlockCard />}
    />
  );
}
