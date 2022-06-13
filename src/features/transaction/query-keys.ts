export enum TransactionQueryKeys {
  transaction = 'transaction',
  mempoolTransactionsForAddress = 'mempoolTransactionsForAddress',
  transactionsForAddress = 'transactionsForAddress',
  contract = 'contract',
  accountBalance = 'accountBalance',
  lastFourBlocks = 'lastFourBlocks',
}
export const transactionQK = (type: TransactionQueryKeys, id: string) => [type, id];
