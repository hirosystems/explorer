import { getToAddress } from '@/app/transactions/utils';
import { getTxTitle, truncateHex, truncateStxAddress } from '@/common/utils/utils';
import { TransactionStatusBadge, TransactionTypeBadge } from '@/ui/Badge';
import { Text } from '@/ui/Text';
import { Flex, Icon, Stack } from '@chakra-ui/react';
import { ArrowRight } from '@phosphor-icons/react';
import { forwardRef } from 'react';

import { MempoolTransaction, Transaction } from '@stacks/stacks-blockchain-api-types';

const BORDER_WIDTH = 1;

export const TxHeader = forwardRef<HTMLDivElement, { tx: Transaction | MempoolTransaction }>(
  ({ tx }, ref) => {
    return (
      <Flex
        bg={
          'linear-gradient(to bottom, var(--stacks-colors-accent-bitcoin-500), var(--stacks-colors-surface-primary))'
        }
        padding={`${BORDER_WIDTH}px`}
        borderRadius={`calc(var(--stacks-radii-redesign-xl) + ${BORDER_WIDTH}px)`}
        boxShadow="var(--stacks-shadows-elevation2)"
        ref={ref}
      >
        <Stack p={4} gap={3} w="full" borderRadius="redesign.xl" bg="surfaceSecondary">
          <Flex gap={2}>
            <TransactionTypeBadge tx={tx} />
            <TransactionStatusBadge tx={tx} />
          </Flex>
          <Flex gap={4} flexWrap="wrap">
            <Text textStyle="heading-sm">{getTxTitle(tx)}</Text>
            <Flex gap={2} flexWrap="wrap">
              <Flex px={3} py={1} bg="surfacePrimary" borderRadius="redesign.md">
                <Text textStyle="text-medium-md" whiteSpace="nowrap">
                  {truncateHex(tx.tx_id, 4, 5, false)}
                </Text>
              </Flex>
              <Flex gap={1} alignItems="center">
                <Flex px={3} py={1} bg="surfacePrimary" borderRadius="redesign.md">
                  <Text textStyle="text-medium-md" whiteSpace="nowrap">
                    {truncateStxAddress(tx.sender_address)}
                  </Text>
                </Flex>
                <Icon h={6} w={3.5} color="iconTertiary">
                  <ArrowRight />
                </Icon>
                <Flex px={3} py={1} bg="surfacePrimary" borderRadius="redesign.md">
                  <Text textStyle="text-medium-md" whiteSpace="nowrap">
                    {truncateStxAddress(getToAddress(tx))}
                  </Text>
                </Flex>
              </Flex>
            </Flex>
          </Flex>
        </Stack>
      </Flex>
    );
  }
);

export const TxHeaderMinimized = ({ tx }: { tx: Transaction | MempoolTransaction }) => {
  return (
    <Flex
      bg={
        'linear-gradient(to bottom, var(--stacks-colors-accent-bitcoin-500), var(--stacks-colors-surface-primary))'
      }
      padding={`${BORDER_WIDTH}px`}
      borderRadius={`calc(var(--stacks-radii-redesign-xl) + ${BORDER_WIDTH}px)`}
      boxShadow="elevation2"
    >
      <Flex
        p={2}
        gap={3}
        w="full"
        borderRadius="redesign.xl"
        bg="surfaceSecondary"
        alignItems="baseline"
      >
        <Flex gap={1} alignItems="center">
          <TransactionTypeBadge tx={tx} withoutLabel />
          <TransactionStatusBadge tx={tx} withoutLabel />
        </Flex>
        <Flex gap={3}>
          <Text textStyle="text-medium-md">{getTxTitle(tx)}</Text>
          <Flex alignItems="center" gap={2}>
            <Flex px={3} py={1} bg="surfacePrimary" borderRadius="redesign.md">
              <Text textStyle="text-medium-sm">{truncateHex(tx.tx_id, 4, 5, false)}</Text>
            </Flex>
            <Flex gap={1} alignItems="center">
              <Flex px={2} py={1} bg="surfacePrimary" borderRadius="redesign.md">
                <Text textStyle="text-medium-sm">{truncateStxAddress(tx.sender_address)}</Text>
              </Flex>
              <Icon h={5} w={3} color="iconTertiary">
                <ArrowRight />
              </Icon>
              <Flex px={2} py={1} bg="surfacePrimary" borderRadius="redesign.md">
                <Text textStyle="text-medium-sm">{truncateStxAddress(getToAddress(tx))}</Text>
              </Flex>
            </Flex>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
};
