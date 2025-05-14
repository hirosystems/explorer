import { AddressLink, TxLink } from '@/common/components/ExplorerLinks';
import { getTxTypeColor, getTxTypeIcon, getTxTypeLabel } from '@/common/utils/transactions';
import {
  formatStacksAmount,
  getContractName,
  microToStacksFormatted,
  truncateStxAddress,
} from '@/common/utils/utils';
import { Text, TextProps } from '@/ui/Text';
import { Tooltip } from '@/ui/Tooltip';
import ClarityIcon from '@/ui/icons/ClarityIcon';
import MicroStxIcon from '@/ui/icons/MicroStxIcon';
import StacksIconThin from '@/ui/icons/StacksIconThin';
import { Flex, Icon } from '@chakra-ui/react';
import { Clock, Question, XCircle } from '@phosphor-icons/react';

import {
  MempoolTransactionStatus,
  Transaction,
  TransactionStatus,
} from '@stacks/stacks-blockchain-api-types';

import { TxTableAddressColumnData, TxTableTransactionColumnData } from './TxsTable';

const EllipsisText = ({ children, ...textProps }: { children: React.ReactNode } & TextProps) => {
  return (
    <Text
      whiteSpace="nowrap"
      overflow="hidden"
      textOverflow="ellipsis"
      fontSize="sm"
      {...textProps}
    >
      {children}
    </Text>
  );
};

export const TxTypeCellRenderer = ({ txType }: { txType: string }) => {
  return (
    <Flex
      py={1}
      pl={1}
      pr={1.5}
      bg="surfaceSecondary"
      w="fit-content"
      alignItems="center"
      gap={1.5}
      border="1px solid var(--stacks-colors-redesign-border-secondary)"
      borderRadius="redesign.md"
    >
      <Flex
        alignItems="center"
        justifyContent="center"
        p={1}
        borderRadius="redesign.sm"
        bg={getTxTypeColor(txType)}
      >
        <Icon h={3} w={3} color="neutral.sand-1000">
          {getTxTypeIcon(txType)}
        </Icon>
      </Flex>
      <Text textStyle="text-medium-xs" color="textPrimary" whiteSpace="nowrap">
        {getTxTypeLabel(txType)}
      </Text>
    </Flex>
  );
};

export const TxLinkCellRenderer = (value: string) => {
  return (
    <TxLink txId={value} variant="tableLink">
      <EllipsisText>{value}</EllipsisText>
    </TxLink>
  );
};

export const AddressLinkCellRenderer = (value: TxTableAddressColumnData) => {
  const { address, isContract } = value;
  return address && isContract ? (
    <Flex
      gap={1}
      alignItems="center"
      bg="surfacePrimary"
      borderRadius="redesign.md"
      py={0.5}
      px={1}
      w="fit-content"
      _groupHover={{
        bg: 'surfaceTertiary',
      }}
    >
      <Icon h={3} w={3} color="iconPrimary">
        <ClarityIcon />
      </Icon>
      <AddressLink principal={address} variant="tableLink">
        <EllipsisText
          textStyle="text-regular-xs"
          color="textPrimary"
          _hover={{
            color: 'textInteractiveHover',
          }}
          fontFamily="var(--font-matter-mono)"
        >
          {getContractName(address)}
        </EllipsisText>
      </AddressLink>
    </Flex>
  ) : address && !isContract ? (
    <AddressLink principal={address} variant="tableLink">
      <EllipsisText fontSize="sm">{truncateStxAddress(address)}</EllipsisText>
    </AddressLink>
  ) : (
    <EllipsisText fontSize="sm">-</EllipsisText>
  );
};

export const FeeCellRenderer = (value: string) => {
  const stx = microToStacksFormatted(value);
  const microStx = formatStacksAmount(value);

  return (
    <Flex alignItems="center" gap={1}>
      <Icon h={3} w={3} color="textSecondary">
        {stx.length > microStx.length ? <MicroStxIcon /> : <StacksIconThin />}
      </Icon>
      <EllipsisText fontSize="sm">
        {stx.length > microStx.length ? `${microStx} µSTX` : `${stx} STX`}
      </EllipsisText>
    </Flex>
  );
};

export const AmountCellRenderer = (value: number) => {
  return (
    <Flex alignItems="center" gap={1}>
      <Icon h={3} w={3} color="textSecondary">
        <StacksIconThin />
      </Icon>
      <EllipsisText fontSize="sm">{value} STX</EllipsisText>
    </Flex>
  );
};

export const TimeStampCellRenderer = (value: string, tooltip?: string) => {
  const content = (
    <Flex
      alignItems="center"
      bg="surfacePrimary"
      borderRadius="md"
      py={0.5}
      px={1}
      w="fit-content"
      _groupHover={{
        bg: 'surfaceTertiary',
      }}
    >
      <EllipsisText
        fontSize="xs"
        fontFamily="var(--font-matter-mono)"
        suppressHydrationWarning={true}
      >
        {value}
      </EllipsisText>
    </Flex>
  );

  if (tooltip) {
    return <Tooltip content={tooltip}>{content}</Tooltip>;
  }

  return content;
};

export const IconCellRenderer = (value: React.ReactNode) => {
  return (
    <Icon h={3} w={3} color="textSecondary">
      {value}
    </Icon>
  );
};

function getTxStatusIcon(status: TransactionStatus | MempoolTransactionStatus) {
  switch (status) {
    case 'pending':
      return <Clock />;
    case 'abort_by_post_condition':
      return <XCircle />;
    case 'abort_by_response':
      return <XCircle />;
    default:
      return <Question />;
  }
}

function getTxStatusLabel(status: TransactionStatus | MempoolTransactionStatus) {
  switch (status) {
    case 'pending':
      return 'Pending';
    case 'abort_by_post_condition':
      return 'Failed';
    case 'abort_by_response':
      return 'Failed';
    default:
      return 'Unknown';
  }
}

function getTxStatusIconColor(status: TransactionStatus | MempoolTransactionStatus) {
  switch (status) {
    case 'pending':
      return 'transactionStatus.pending';
    case 'abort_by_post_condition':
      return 'feedback.red-600';
    case 'abort_by_response':
      return 'feedback.red-600';
    default:
      return 'iconSecondary';
  }
}

function getTxStatusBgColor(status: TransactionStatus | MempoolTransactionStatus) {
  switch (status) {
    case 'pending':
      return 'transactionStatus.pending';
    case 'abort_by_post_condition':
      return 'transactionStatus.failed';
    case 'abort_by_response':
      return 'transactionStatus.failed';
    default:
      return 'surfaceSecondary';
  }
}

const StatusTag = ({ status }: { status: TransactionStatus | MempoolTransactionStatus }) => {
  return (
    <Flex
      alignItems="center"
      gap={1}
      px={1.5}
      py={1}
      bg={getTxStatusBgColor(status)}
      borderRadius="redesign.md"
    >
      <Icon h={3} w={3} color={getTxStatusIconColor(status)}>
        {getTxStatusIcon(status)}
      </Icon>
    </Flex>
  );
};

const txTextMap: Record<Transaction['tx_type'], (data: TxTableTransactionColumnData) => string> = {
  contract_call: (data: TxTableTransactionColumnData) => data.functionName ?? '',
  token_transfer: (data: TxTableTransactionColumnData) => `Send ${data.amount} STX`,
  tenure_change: (data: TxTableTransactionColumnData) =>
    `Tenure ${data.tenureChangePayload?.cause} (#${data.blockHeight})`,
  coinbase: (data: TxTableTransactionColumnData) => `Block #${data.blockHeight}`,
  smart_contract: (data: TxTableTransactionColumnData) =>
    getContractName(data.smartContract?.contractId ?? ''),
  poison_microblock: (data: TxTableTransactionColumnData) => '',
};

export const TransactionTitleCellRenderer = (value: TxTableTransactionColumnData) => {
  const { txType, status, txId } = value;

  const text = txType ? txTextMap[txType as keyof typeof txTextMap](value) : '';

  let content = (
    <TxLink txId={txId} variant="tableLink">
      <EllipsisText textStyle="text-medium-sm">{text}</EllipsisText>
    </TxLink>
  );

  if (status && status !== 'success') {
    return (
      <Flex alignItems="center" gap={1.5}>
        {content}
        <StatusTag status={status} />
      </Flex>
    );
  }
  return content;
};
