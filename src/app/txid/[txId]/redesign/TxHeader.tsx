import { useIsInViewport } from '@/common/hooks/useIsInViewport';
import { TxDetails } from '@/common/types/tx-v3';
import { getTxTypeColor } from '@/common/utils/transactions';
import {
  getTxDetailsStatus,
  getTxDetailsTitle,
  getTxDetailsToAddress,
} from '@/common/utils/tx-details-utils';
import {
  truncateHex,
  truncateStxAddress,
  truncateStxContractId,
  validateStacksContractId,
} from '@/common/utils/utils';
import { TransactionStatusBadge, TransactionTypeBadge } from '@/ui/Badge';
import { Text } from '@/ui/Text';
import { Tooltip } from '@/ui/Tooltip';
import { Box, Flex, Icon, Stack, useClipboard } from '@chakra-ui/react';
import { ArrowRight } from '@phosphor-icons/react';
import { motion } from 'motion/react';
import { forwardRef, useRef } from 'react';

const BORDER_WIDTH = 1;

const Badge = ({
  value,
  copyValue,
  copiedText,
}: {
  value: string;
  copyValue: string;
  copiedText: string;
}) => {
  const { copied, copy } = useClipboard({
    value: copyValue,
    timeout: 750,
  });

  return (
    <Tooltip content={copiedText || 'Copied!'} open={copied} variant="redesignPrimary">
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

const TxIdBadge = ({ tx }: { tx: TxDetails }) => {
  return (
    <Badge
      value={truncateHex(tx.tx_id, 4, 5, false)}
      copyValue={tx.tx_id}
      copiedText="Transaction ID copied to clipboard"
    />
  );
};

const AddressBadge = ({ address }: { address: string }) => {
  const isContract = validateStacksContractId(address);
  return address ? (
    <Badge
      copyValue={address}
      value={isContract ? truncateStxContractId(address) : truncateStxAddress(address)}
      copiedText={`Address copied to clipboard`}
    />
  ) : null;
};

const FromToBadges = ({ tx }: { tx: TxDetails }) => {
  const toAddress = getTxDetailsToAddress(tx);
  return (
    <Flex gap={1} alignItems="center" flexWrap="wrap">
      <AddressBadge address={tx.sender.address} />
      {toAddress ? (
        <>
          <Icon h={6} w={3.5} color="iconTertiary">
            <ArrowRight weight="bold" />
          </Icon>
          <AddressBadge address={toAddress} />
        </>
      ) : null}
    </Flex>
  );
};

export const TxHeaderUnminimized = forwardRef<HTMLDivElement, { tx: TxDetails }>(({ tx }, ref) => {
  return (
    <Flex
      bg={`linear-gradient(to bottom, ${getTxTypeColor(tx.type)}, var(--stacks-colors-surface-primary))`}
      padding={`${BORDER_WIDTH}px`}
      borderRadius={`calc(var(--stacks-radii-redesign-xl) + ${BORDER_WIDTH}px)`}
      boxShadow="elevation2"
      ref={ref}
    >
      <Stack p={4} gap={3} w="full" borderRadius="redesign.xl" bg="surfaceSecondary">
        <Flex gap={2}>
          <TransactionTypeBadge txType={tx.type} />
          <TransactionStatusBadge status={getTxDetailsStatus(tx)} />
        </Flex>
        <Flex gap={4} flexWrap="wrap">
          <Text textStyle="heading-sm">{getTxDetailsTitle(tx)}</Text>
          <Flex gap={2} flexWrap="wrap">
            <TxIdBadge tx={tx} />
            <FromToBadges tx={tx} />
          </Flex>
        </Flex>
      </Stack>
    </Flex>
  );
});

export const TxHeaderMinimized = ({ tx }: { tx: TxDetails }) => {
  return (
    <Flex
      bg={`linear-gradient(to bottom, ${getTxTypeColor(tx.type)}, var(--stacks-colors-surface-primary))`}
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
        alignItems="center"
      >
        <Flex gap={1} alignItems="center">
          <TransactionTypeBadge txType={tx.type} withoutLabel />
          <TransactionStatusBadge status={getTxDetailsStatus(tx)} withoutLabel />
        </Flex>
        <Flex gap={3} alignItems="center">
          <Text textStyle="text-medium-md">{getTxDetailsTitle(tx)}</Text>
          <Flex alignItems="center" gap={2} hideBelow="md">
            <TxIdBadge tx={tx} />
            <FromToBadges tx={tx} />
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
};

export const TxHeader = ({ tx }: { tx: TxDetails }) => {
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
