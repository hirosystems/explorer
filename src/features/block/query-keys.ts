export enum BlockQueryKeys {
  block = 'block',
  blocks = 'blocks',
  blockTransactions = 'blockTransactions',
}
export const blockQK = (type: BlockQueryKeys, hash: string) => [type, hash];
