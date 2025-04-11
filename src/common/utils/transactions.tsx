'use client';

import ClarityIcon from '@/ui/icons/ClarityIcon';
import TransferIcon from '@/ui/icons/TransferIcon';
import { ArrowsClockwise, Cube, PhoneCall, Question } from '@phosphor-icons/react';

import {
  MempoolTransaction,
  Transaction,
  TransactionType,
} from '@stacks/stacks-blockchain-api-types';

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
