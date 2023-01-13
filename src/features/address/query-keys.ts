export enum AddressQueryKeys {
  coreApiInfo = 'coreApiInfo',
  accountBalance = 'accountBalance',
  accountInfo = 'accountInfo',
  mempoolTransactionsForAddress = 'mempoolTransactionsForAddress',
  transactionsForAddress = 'transactionsForAddress',
  nonce = 'nonceForAddress',
  nftHoldings = 'nftHoldings',
}
export const addressQK = (type: AddressQueryKeys, id?: string): (string | undefined)[] => [
  type,
  id,
];
