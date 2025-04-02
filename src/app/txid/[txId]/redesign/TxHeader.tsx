import { useIsInViewport } from '@/common/hooks/useIsInViewport';
import { getToAddress } from '@/common/utils/transaction-utils';
import { getTxTitle, truncateHex, truncateStxAddress } from '@/common/utils/utils';
import { TransactionStatusBadge, TransactionTypeBadge } from '@/ui/Badge';
import { Text } from '@/ui/Text';
import { Tooltip } from '@/ui/Tooltip';
import { Box, Flex, Icon, Stack, useClipboard } from '@chakra-ui/react';
import { ArrowRight } from '@phosphor-icons/react';
import { motion } from 'motion/react';
import { forwardRef, useRef } from 'react';

import { MempoolTransaction, Transaction } from '@stacks/stacks-blockchain-api-types';

const BORDER_WIDTH = 1;

const Badge = ({ value, copiedText }: { value: string; copiedText: string }) => {
  const { copied, copy } = useClipboard({
    value,
    timeout: 750,
  });

  return (
    <Tooltip content={copiedText || 'Copied!'} open={copied}>
      <Flex
        px={3}
        py={1}
        bg="surfacePrimary"
        _hover={{
          bg: 'surfaceFifth',
        }}
        borderRadius="redesign.md"
        alignItems="center"
        cursor="pointer"
        onClick={() => copy()}
      >
        <Text textStyle="text-medium-md" whiteSpace="nowrap">
          {value}
        </Text>
      </Flex>
    </Tooltip>
  );
};

const TxIdBadge = ({ tx }: { tx: Transaction | MempoolTransaction }) => {
  return (
    <Badge
      value={truncateHex(tx.tx_id, 4, 5, false)}
      copiedText="Transaction ID copied to clipboard"
    />
  );
};

const AddressBadge = ({ address }: { address: string }) => {
  return address ? (
    <Badge value={truncateStxAddress(address)} copiedText={`Address copied to clipboard`} />
  ) : null;
};

const FromToBadges = ({ tx }: { tx: Transaction | MempoolTransaction }) => {
  const toAddress = getToAddress(tx);
  return (
    <Flex gap={1} alignItems="center">
      <AddressBadge address={tx.sender_address} />
      {toAddress ? (
        <>
          <Icon h={6} w={3.5} color="iconTertiary">
            <ArrowRight />
          </Icon>
          <AddressBadge address={toAddress} />
        </>
      ) : null}
    </Flex>
  );
};

export const TxHeaderUnminimized = forwardRef<
  HTMLDivElement,
  { tx: Transaction | MempoolTransaction }
>(({ tx }, ref) => {
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
            <TxIdBadge tx={tx} />
            <FromToBadges tx={tx} />
          </Flex>
        </Flex>
      </Stack>
    </Flex>
  );
});

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
          <Flex alignItems="center" gap={2} hideBelow="md">
            <TxIdBadge tx={tx} />
            <FromToBadges tx={tx} />
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
};

export const TxHeader = ({ tx }: { tx: Transaction | MempoolTransaction }) => {
  const txHeaderRef = useRef<HTMLDivElement>(null);
  const isHeaderInView = useIsInViewport(txHeaderRef);

  return (
    <>
      <TxHeaderUnminimized tx={tx} ref={txHeaderRef} />
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{
          opacity: isHeaderInView ? 0 : 1,
          y: isHeaderInView ? -20 : 0,
          pointerEvents: isHeaderInView ? 'none' : 'auto',
        }}
        transition={{ duration: 0.3 }}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 'var(--stacks-z-index-docked)',
        }}
      >
        <Box borderRadius="redesign.xl" pt={3} px={6} bg="transparent">
          <TxHeaderMinimized tx={tx} />
        </Box>
      </motion.div>
    </>
  );
};
