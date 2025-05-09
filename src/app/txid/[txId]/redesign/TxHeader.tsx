import { getToAddress, getTxTitle } from '@/common/utils/transactions';
import { truncateHex, truncateStxAddress } from '@/common/utils/utils';
import { Text } from '@/ui/Text';
import { Flex, Icon, Stack } from '@chakra-ui/react';
import { ArrowLeft, ArrowRight } from '@phosphor-icons/react';

import { Transaction } from '@stacks/stacks-blockchain-api-types';

import { TransactionStatusBadge, TransactionTypeBadge } from './Badge';

export const TxHeader = ({ tx }: { tx: Transaction }) => {
  return (
    <Stack
      p={4}
      gap={3}
      w="full"
      borderRadius="redesign.xl"
      bg="surfaceSecondary"
      boxShadow="var(--stacks-shadows-elevation2)"
    >
      <Flex gap={2}>
        <TransactionTypeBadge tx={tx} />
        <TransactionStatusBadge tx={tx} />
      </Flex>
      <Flex gap={4}>
        <Text textStyle="heading-sm">{getTxTitle(tx)}</Text>
        <Flex alignItems="center" gap={2}>
          <Flex px={3} py={1} bg="surfacePrimary" borderRadius="redesign.md">
            <Text textStyle="text-medium-md">{truncateHex(tx.tx_id, 4, 5, false)}</Text>
          </Flex>
          <Flex gap={1} alignItems="center">
            <Flex px={3} py={1} bg="surfacePrimary" borderRadius="redesign.md">
              <Text textStyle="text-medium-md">{truncateStxAddress(tx.sender_address)}</Text>
            </Flex>
            <Icon h={6} w={3.5} color="iconTertiary">
              <ArrowRight />
            </Icon>
            <Flex px={3} py={1} bg="surfacePrimary" borderRadius="redesign.md">
              <Text textStyle="text-medium-md">{truncateStxAddress(getToAddress(tx))}</Text>
            </Flex>
          </Flex>
        </Flex>
      </Flex>
    </Stack>
  );
};
