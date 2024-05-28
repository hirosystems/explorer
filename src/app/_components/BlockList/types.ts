import { Block, BurnBlock } from '@stacks/blockchain-api-client';

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

export interface BlockListBtcBlock {
  type: 'btc_block';
  height: number | string;
  hash: string;
  timestamp: number;
  txsCount: number;
  blockCount: number;
  avgBlockTime: number;
}

export interface BlockListStxBlock {
  type: 'stx_block';
  height: number | string;
  hash: string;
  timestamp: number;
  txsCount?: number;
}
