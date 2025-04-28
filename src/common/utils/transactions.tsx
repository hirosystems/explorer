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

export function getTxStatusIcon(tx: Transaction | MempoolTransaction) {
  const txStatus = getTransactionStatus(tx);
  switch (txStatus) {
    case TransactionStatus.PENDING:
      return <Clock />;
    case TransactionStatus.SUCCESS_ANCHOR_BLOCK:
      return <CheckCircle />;
    case TransactionStatus.SUCCESS_MICROBLOCK:
      return <CheckCircle />;
    case TransactionStatus.NON_CANONICAL:
      return <CheckCircle />;
    case TransactionStatus.FAILED:
      return <XCircle />;
    case TransactionStatus.DROPPED:
      return <XCircle />;
    default:
      return <Question />;
  }
}

export function getTxStatusIconColor(tx: Transaction | MempoolTransaction) {
  const txStatus = getTransactionStatus(tx);
  switch (txStatus) {
    case TransactionStatus.PENDING:
      return 'feedback.bronze-600';
    case TransactionStatus.SUCCESS_ANCHOR_BLOCK:
      return 'feedback.green-500';
    case TransactionStatus.SUCCESS_MICROBLOCK:
      return 'feedback.green-500';
    case TransactionStatus.NON_CANONICAL:
      return 'feedback.green-500';
    case TransactionStatus.FAILED:
      return 'iconError';
    case TransactionStatus.DROPPED:
      return 'iconError';
    default:
      return 'iconError';
  }
}

export function getTxStatusBgColor(tx: Transaction | MempoolTransaction) {
  const txStatus = getTransactionStatus(tx);
  switch (txStatus) {
    case TransactionStatus.PENDING:
      return 'transactionStatus.pending';
    case TransactionStatus.SUCCESS_ANCHOR_BLOCK:
      return 'transactionStatus.confirmed';
    case TransactionStatus.SUCCESS_MICROBLOCK:
      return 'transactionStatus.confirmed';
    case TransactionStatus.NON_CANONICAL:
      return 'transactionStatus.confirmed';
    case TransactionStatus.FAILED:
      return 'transactionStatuses.failed';
    case TransactionStatus.DROPPED:
      return 'transactionStatuses.failed';
    default:
      return 'surfacePrimary';
  }
}

export function getTxStatusLabel(tx: Transaction | MempoolTransaction) {
  const txStatus = getTransactionStatus(tx);
  switch (txStatus) {
    case TransactionStatus.PENDING:
      return 'Pending';
    case TransactionStatus.SUCCESS_ANCHOR_BLOCK:
      return 'Confirmed';
    case TransactionStatus.SUCCESS_MICROBLOCK:
      return 'Confirmed';
    case TransactionStatus.NON_CANONICAL:
      return 'Confirmed';
    case TransactionStatus.FAILED:
      return 'Failed';
    case TransactionStatus.DROPPED:
      return 'Failed';
    default:
      return 'Unknown';
  }
}
