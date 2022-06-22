export enum BlockQueryKeys {
  block = 'block',
  blockTransactions = 'blockTransactions',
}
export const blockQK = (type: BlockQueryKeys, hash: string) => [type, hash];
