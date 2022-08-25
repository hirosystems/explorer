export enum TransactionQueryKeys {
  transaction = 'transaction',
  mempoolTransactionsForAddress = 'mempoolTransactionsForAddress',
  mempoolTransactionsForAddressInfinite = 'mempoolTransactionsForAddressInfinite',
  transactionsForAddress = 'transactionsForAddress',
  transactionsWithTransfersForAddressInfinite = 'transactionsWithTransfersForAddressInfinite',
  contract = 'contract',
  accountBalance = 'accountBalance',
  lastFourBlocks = 'lastFourBlocks',
}
export const transactionQK = (type: TransactionQueryKeys, id: string | undefined) => [type, id];
