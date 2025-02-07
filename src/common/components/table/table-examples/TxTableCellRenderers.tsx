import { AddressLink, TxLink } from '@/common/components/ExplorerLinks';
import { getContractName, truncateMiddle } from '@/common/utils/utils';
import { Text } from '@/ui/Text';
import ClarityIcon from '@/ui/icons/ClarityIcon';
import StxIcon from '@/ui/icons/StxIcon';
import { Flex, Icon } from '@chakra-ui/react';
import { ArrowsLeftRight, Clock, Cube, PhoneCall, Question, XCircle } from '@phosphor-icons/react';

import { MempoolTransactionStatus, TransactionStatus } from '@stacks/stacks-blockchain-api-types';

import { TxTableTransactionColumnData } from './TxsTable';

export const defaultCellRenderer = (value: string) => {
  return (
    <Text whiteSpace="nowrap" overflow="hidden" textOverflow="ellipsis" fontSize="sm">
      {String(value)}
    </Text>
  );
};

function getTxTypeIcon(txType: string) {
  switch (txType) {
    case 'token_transfer':
      return <ArrowsLeftRight style={{ transform: 'rotate(-60deg)' }} />;
    case 'contract_call':
      return <PhoneCall />;
    case 'smart_contract':
      return <ClarityIcon />;
    case 'tenure_change':
      return <Cube />;
    default:
      return <Question />;
  }
}

function getTxTypeLabel(txType: string) {
  switch (txType) {
    case 'token_transfer':
      return 'Token Transfer';
    case 'contract_call':
      return 'Contract Call';
    case 'smart_contract':
      return 'Contract Deploy';
    case 'tenure_change':
      return 'Tenure Change';
    case 'coinbase':
      return 'Coinbase';
    default:
      return 'Unknown';
  }
}

function getTxTypeColor(txType: string) {
  switch (txType) {
    case 'token_transfer':
      return 'transactionTypes.tokenTransfer';
    case 'contract_call':
      return 'transactionTypes.contractCall';
    case 'smart_contract':
      return 'transactionTypes.contractDeploy';
    case 'tenure_change':
      return 'transactionTypes.tenureChange';
    case 'coinbase':
      return 'transactionTypes.coinbase';
  }
}

export const TxTypeCellRenderer = ({ txType }: { txType: string }) => {
  return (
    <Flex
      p={1}
      borderRadius="md"
      borderColor="surfaceSecondary"
      borderWidth={1}
      borderStyle="solid"
      bg="surfaceSecondary"
      w="fit-content"
    >
      <Flex alignItems="center" gap={1.5}>
        <Flex
          alignItems="center"
          justifyContent="center"
          p={1}
          borderRadius="sm"
          bg={getTxTypeColor(txType)}
        >
          <Icon h={3} w={3} color="neutral.sand-1000">
            {getTxTypeIcon(txType)}
          </Icon>
        </Flex>
        <Text fontSize="sm" fontWeight="medium" color="textPrimary" whiteSpace="nowrap">
          {getTxTypeLabel(txType)}
        </Text>
      </Flex>
    </Flex>
  );
};

export const TxLinkCellRenderer = (value: string) => {
  return (
    <TxLink txId={value}>
      <Text whiteSpace="nowrap" overflow="hidden" textOverflow="ellipsis" fontSize="sm">
        {value}
      </Text>
    </TxLink>
  );
};

export const AddressLinkCellRenderer = (value: string) => {
  return (
    <AddressLink principal={value}>
      <Text whiteSpace="nowrap" overflow="hidden" textOverflow="ellipsis" fontSize="sm">
        {value}
      </Text>
    </AddressLink>
  );
};

export const FeeCellRenderer = (value: string) => {
  return (
    <Flex alignItems="center" gap={1}>
      <Icon h={3} w={3} color="textSecondary">
        <StxIcon />
      </Icon>
      <Text whiteSpace="nowrap" overflow="hidden" textOverflow="ellipsis" fontSize="sm">
        {value} STX
      </Text>
    </Flex>
  );
};

export const AmountCellRenderer = (value: number) => {
  return (
    <Flex alignItems="center" gap={1}>
      <Icon h={3} w={3} color="textSecondary">
        <StxIcon />
      </Icon>
      <Text whiteSpace="nowrap" overflow="hidden" textOverflow="ellipsis" fontSize="sm">
        {value} STX
      </Text>
    </Flex>
  );
};

export const TimeStampCellRenderer = (value: string) => {
  return (
    <Flex alignItems="center" justifyContent="center" bg="surfacePrimary" borderRadius="sm" p={1.5}>
      <Text whiteSpace="nowrap" overflow="hidden" textOverflow="ellipsis" fontSize="sm">
        {value}
      </Text>
    </Flex>
  );
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
      py={0.5}
      bg={getTxStatusBgColor(status)}
      borderRadius="redesign.md"
    >
      <Icon h={3} w={3} color={getTxStatusIconColor(status)}>
        {getTxStatusIcon(status)}
      </Icon>
    </Flex>
  );
};

export const TransactionTitleCellRenderer = (value: TxTableTransactionColumnData) => {
  const { functionName, contractName, txType, status, amount, tenureChangePayload, smartContract } =
    value;

  let content: React.ReactNode = null;
  if (txType === 'contract_call') {
    content = (
      <Flex gap={1}>
        <Text fontSize="sm" fontWeight="medium" color="textPrimary" whiteSpace="nowrap">
          {functionName}
        </Text>
        <Flex gap={1} alignItems="center" bg="surfacePrimary" borderRadius="md" px={1.5} py={0.5}>
          <Icon h={3} w={3} color="iconSecondary">
            <ClarityIcon />
          </Icon>
          <Text fontSize="xs" fontWeight="medium" color="textSecondary" whiteSpace="nowrap">
            {getContractName(contractName ?? '')}
          </Text>
        </Flex>
      </Flex>
    );
  }
  if (txType === 'token_transfer') {
    content = (
      <Text fontSize="sm" fontWeight="medium" color="textPrimary">
        {amount} STX
      </Text>
    );
  }

  if (txType === 'tenure_change') {
    content = (
      <Text fontSize="sm" fontWeight="medium" color="textPrimary">
        Tenure {tenureChangePayload?.cause}
      </Text>
    );
  }

  if (txType === 'coinbase') {
    content = (
      <Text fontSize="sm" fontWeight="medium" color="textPrimary">
        Coinbase
      </Text>
    );
  }

  if (txType === 'smart_contract') {
    content = (
      <Text fontSize="sm" fontWeight="medium" color="textPrimary">
        {truncateMiddle(smartContract?.contractId ?? '')}
      </Text>
    );
  }

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
