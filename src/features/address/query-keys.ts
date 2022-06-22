export enum AddressQueryKeys {
  coreApiInfo = 'coreApiInfo',
  accountBalance = 'accountBalance',
  accountInfo = 'accountInfo',
  mempoolTransactionsForAddress = 'mempoolTransactionsForAddress',
  transactionsForAddress = 'transactionsForAddress',
  nonce = 'nonceForAddress',
}
export const addressQK = (type: AddressQueryKeys, id?: string) => [type, id];
