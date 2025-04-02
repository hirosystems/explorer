'use client';

import { getContractName } from '@/common/utils/utils';
import ClarityIcon from '@/ui/icons/ClarityIcon';
import TransferIcon from '@/ui/icons/TransferIcon';
import {
  CheckCircle,
  Clock,
  Cube,
  PhoneCall,
  PlusMinus,
  Question,
  XCircle,
} from '@phosphor-icons/react';

import {
  ContractCallTransaction,
  MempoolTransaction,
  SmartContractTransaction,
  TenureChangeTransaction,
  TokenTransferTransaction,
  Transaction,
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
      return <Cube />;
    case 'all':
      return <PlusMinus weight="bold" />;
    default:
      return <Question />;
  }
}

export function getTxTypeLabel(txType: string) {
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
    case 'all':
      return 'Average';
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

export function getTxStatusIcon(txStatus: string) {
  switch (txStatus) {
    case 'success':
      return <CheckCircle />;
    case 'pending':
      return <Clock />;
    case 'failed':
      return <XCircle />;
    default:
      return <Question />;
  }
}

export function getTxTitle(tx: Transaction) {
  switch (tx.tx_type) {
    case 'contract_call':
      return (tx as ContractCallTransaction).contract_call.function_name;
    case 'token_transfer':
      return `Send ${(tx as TokenTransferTransaction).token_transfer.amount} STX`;
    case 'tenure_change':
      return `Tenure ${(tx as TenureChangeTransaction).tenure_change_payload?.cause} (#${tx.block_height})`;
    case 'coinbase':
      return `Block #${tx.block_height}`;
    case 'smart_contract':
      return getContractName((tx as SmartContractTransaction).smart_contract.contract_id);
    case 'poison_microblock':
      return '';
    default:
      return '';
  }
}

export function getTxStatusIconColor(tx: Transaction) {
  const txStatus = getTransactionStatus(tx);
  switch (txStatus) {
    case TransactionStatus.PENDING:
      return 'transactionStatus.pending';
    case TransactionStatus.FAILED:
      return 'feedback.red-600';
    case TransactionStatus.DROPPED:
      return 'feedback.red-600';
    case TransactionStatus.NON_CANONICAL:
      return 'feedback.red-600';
    case TransactionStatus.SUCCESS_ANCHOR_BLOCK:
      return 'feedback.green-500';
    // case TransactionStatus.SUCCESS_MICROBLOCK:
    //   return 'feedback.green-500';
    default:
      return 'iconSecondary';
  }
}

export function getTxStatusBgColor(tx: Transaction) {
  const txStatus = getTransactionStatus(tx);
  switch (txStatus) {
    case TransactionStatus.PENDING:
      return 'transactionStatus.pending';
    case TransactionStatus.FAILED:
      return 'transactionStatus.failed';
    case TransactionStatus.DROPPED:
      return 'transactionStatus.failed';
    case TransactionStatus.NON_CANONICAL:
      return 'transactionStatus.failed';
    case TransactionStatus.SUCCESS_ANCHOR_BLOCK:
      return 'transactionStatus.success';
    // case TransactionStatus.SUCCESS_MICROBLOCK:
    //   return 'transactionStatus.success';
    default:
      return 'surfaceSecondary';
  }
}

export function getToAddress(tx: Transaction): string {
  if (tx.tx_type === 'token_transfer') {
    return tx.token_transfer?.recipient_address;
  }
  if (tx.tx_type === 'smart_contract') {
    return tx.smart_contract?.contract_id;
  }
  if (tx.tx_type === 'contract_call') {
    return tx.contract_call?.contract_id;
  }
  if (tx.tx_type === 'coinbase') {
    return tx.coinbase_payload?.alt_recipient ?? '';
  }
  if (tx.tx_type === 'tenure_change') {
    return '';
  }
  return '';
}

export function getTxStatusLabel(tx: Transaction) {
  const txStatus = getTransactionStatus(tx);
  switch (txStatus) {
    case TransactionStatus.PENDING:
      return 'Pending';
    case TransactionStatus.FAILED:
      return 'Failed';
    case TransactionStatus.DROPPED:
      return 'Failed';
    case TransactionStatus.NON_CANONICAL:
      return 'Failed';
    case TransactionStatus.SUCCESS_ANCHOR_BLOCK:
      return 'Confirmed';
    // case TransactionStatus.SUCCESS_MICROBLOCK:
    //   return 'Success';
    default:
      return 'Unknown';
  }
}