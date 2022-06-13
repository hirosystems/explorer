export enum TransactionQueryKeys {
  transaction = 'transaction',
  mempoolTransactionsForAddress = 'mempoolTransactionsForAddress',
  transactionsForAddress = 'transactionsForAddress',
  contract = 'contract',
  accountBalance = 'accountBalance',
  lastThreeBlocks = 'lastThreeBlocks',
}
export const transactionQK = (type: TransactionQueryKeys, id: string) => [type, id];
