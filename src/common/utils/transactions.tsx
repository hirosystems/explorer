'use client';

import ClarityIcon from '@/ui/icons/ClarityIcon';
import TransferIcon from '@/ui/icons/TransferIcon';
import { ArrowsClockwise, Clock, Cube, PhoneCall, Question, XCircle } from '@phosphor-icons/react';
import { CheckCircle } from '@phosphor-icons/react/dist/ssr';

import { MempoolTransaction, Transaction } from '@stacks/stacks-blockchain-api-types';

import { TransactionStatus } from '../constants/constants';

export function getTransactionStatus(tx: Transaction | MempoolTransaction) {
  if (tx?.tx_status === 'success' && (tx.is_unanchored || tx?.block_hash === '0x')) {
    return TransactionStatus.SUCCESS_MICROBLOCK;
  } else if (tx?.tx_status === 'success' && !tx.is_unanchored) {
    if (!tx.canonical || !tx.microblock_canonical) {
      return TransactionStatus.NON_CANONICAL;
    } else {
      return TransactionStatus.SUCCESS_ANCHOR_BLOCK;
    }
  } else if (tx?.tx_status === 'abort_by_response' || tx?.tx_status === 'abort_by_post_condition') {
    return TransactionStatus.FAILED;
  } else if (tx?.tx_status.startsWith('dropped_')) {
    return TransactionStatus.DROPPED;
  }
  return TransactionStatus.PENDING;
}

export function getTxTypeIcon(txType: string) {
  switch (txType) {
    case 'token_transfer':
      return <TransferIcon />;
    case 'contract_call':
      return <PhoneCall />;
    case 'smart_contract':
      return <ClarityIcon />;
    case 'tenure_change':
      return <ArrowsClockwise />;
    case 'coinbase':
      return <Cube />;
    default:
      return <Question />;
  }
}

export function getTxTypeLabel(txType: string) {
  switch (txType) {
    case 'token_transfer':
      return 'Token transfer';
    case 'contract_call':
      return 'Contract call';
    case 'smart_contract':
      return 'Contract deploy';
    case 'tenure_change':
      return 'Tenure change';
    case 'coinbase':
      return 'Coinbase';
    default:
      return 'Unknown';
  }
}

export function getTxTypeColor(txType: string) {
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
    default:
      return 'transactionTypes.tokenTransfer';
  }
}

const TX_STATUS_ICONS = {
  [TransactionStatus.PENDING]: <Clock />,
  [TransactionStatus.SUCCESS_ANCHOR_BLOCK]: <CheckCircle />,
  [TransactionStatus.SUCCESS_MICROBLOCK]: <CheckCircle />,
  [TransactionStatus.NON_CANONICAL]: <CheckCircle />,
  [TransactionStatus.FAILED]: <XCircle />,
  [TransactionStatus.DROPPED]: <XCircle />,
  default: <Question />,
};

export function getTxStatusIcon(tx: Transaction | MempoolTransaction) {
  const txStatus = getTransactionStatus(tx);
  const icon = TX_STATUS_ICONS[txStatus] || TX_STATUS_ICONS.default;
  return icon;
}

export const TX_STATUS_ICON_COLORS = {
  [TransactionStatus.PENDING]: 'feedback.bronze-600',
  [TransactionStatus.SUCCESS_ANCHOR_BLOCK]: 'feedback.green-500',
  [TransactionStatus.SUCCESS_MICROBLOCK]: 'feedback.green-500',
  [TransactionStatus.NON_CANONICAL]: 'feedback.green-500',
  [TransactionStatus.FAILED]: 'iconError',
  [TransactionStatus.DROPPED]: 'iconError',
  default: 'iconError',
};

export function getTxStatusIconColor(tx: Transaction | MempoolTransaction) {
  const txStatus = getTransactionStatus(tx);
  const iconColor = TX_STATUS_ICON_COLORS[txStatus] || TX_STATUS_ICON_COLORS.default;
  return iconColor;
}

export const TX_STATUS_BG_COLORS = {
  [TransactionStatus.PENDING]: 'transactionStatus.pending',
  [TransactionStatus.SUCCESS_ANCHOR_BLOCK]: 'transactionStatus.confirmed',
  [TransactionStatus.SUCCESS_MICROBLOCK]: 'transactionStatus.confirmed',
  [TransactionStatus.NON_CANONICAL]: 'transactionStatus.confirmed',
  [TransactionStatus.FAILED]: 'transactionStatuses.failed',
  [TransactionStatus.DROPPED]: 'transactionStatuses.failed',
  default: 'surfacePrimary',
};

export function getTxStatusBgColor(tx: Transaction | MempoolTransaction) {
  const txStatus = getTransactionStatus(tx);
  const bgColor = TX_STATUS_BG_COLORS[txStatus] || TX_STATUS_BG_COLORS.default;
  return bgColor;
}

const TX_STATUS_LABELS = {
  [TransactionStatus.PENDING]: 'Pending',
  [TransactionStatus.SUCCESS_ANCHOR_BLOCK]: 'Confirmed',
  [TransactionStatus.SUCCESS_MICROBLOCK]: 'Confirmed',
  [TransactionStatus.NON_CANONICAL]: 'Confirmed',
  [TransactionStatus.FAILED]: 'Failed',
  [TransactionStatus.DROPPED]: 'Failed',
  default: 'Unknown',
};

export function getTxStatusLabel(tx: Transaction | MempoolTransaction) {
  const txStatus = getTransactionStatus(tx);
  const label = TX_STATUS_LABELS[txStatus] || TX_STATUS_LABELS.default;
  return label;
}

export function isConfirmedTx<T extends Transaction, U extends MempoolTransaction>(
  tx: T | U
): tx is T {
  return 'block_height' in tx && tx.block_height !== undefined;
}
