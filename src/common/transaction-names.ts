import { Transaction, TransactionType } from '@models/transaction.interface';

export const txTypeNamesMap = {
  [TransactionType.SMART_CONTRACT]: 'Contract creation',
  [TransactionType.CONTRACT_CALL]: 'Contract call',
  [TransactionType.TOKEN_TRANSFER]: 'Token transfer',
  [TransactionType.COINBASE]: 'Coinbase',
  [TransactionType.POISON_MICROBLOCK]: 'Poison-microblock',
} as const;

export function getTxTypeName(type: TransactionType | Transaction['tx_type']) {
  return txTypeNamesMap[type];
}
