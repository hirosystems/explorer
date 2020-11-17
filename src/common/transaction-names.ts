import { Transaction, TransactionType } from '@models/transaction.interface';

export const txTypeNamesMap = {
  [TransactionType.SMART_CONTRACT]: 'Contract deploy',
  [TransactionType.CONTRACT_CALL]: 'Function call',
  [TransactionType.TOKEN_TRANSFER]: 'Token transfer',
  [TransactionType.COINBASE]: 'Coinbase',
  [TransactionType.POISON_MICROBLOCK]: 'Poison-microblock',
} as const;

export function getTxTypeName(type: Transaction['tx_type']) {
  return txTypeNamesMap[type];
}
