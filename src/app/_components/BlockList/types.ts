import { Block } from '@stacks/stacks-blockchain-api-types';

export type EnhancedBlock = Block & { destroy?: boolean; animate?: boolean };

export enum UIBlockType {
  Block = 'block',
  BurnBlock = 'burn_block',
  Count = 'count',
}

export interface UISingleBlock {
  type: UIBlockType.Block | UIBlockType.BurnBlock;
  height: number | string;
  hash: string;
  timestamp: number;
  txsCount?: number;
}

export interface UIBlockCount {
  type: UIBlockType.Count;
  count: number;
}

export type UIBlock = UISingleBlock | UIBlockCount;
