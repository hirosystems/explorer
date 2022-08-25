export enum MicroblockQueryKeys {
  microblock = 'microblock',
  tx = 'tx',
}
export const microblockQK = (type: MicroblockQueryKeys, id: string) => [type, id];
