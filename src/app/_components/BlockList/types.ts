import { Block } from '@stacks/stacks-blockchain-api-types';

export type EnhancedBlock = Block & { destroy?: boolean; animate?: boolean };

export enum UIBlockType {
  StxBlock = 'stx-block',
  BurnBlock = 'burn_block',
  Count = 'count',
}

export interface UISingleBlock {
  type: UIBlockType.StxBlock | UIBlockType.BurnBlock;
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

export type BlockListBlockType = 'stx_block' | 'btc_block';
export interface BlockListBtcBlock {
  type: 'btc_block';
  height: number | string;
  hash: string;
  timestamp: number;
  txsCount?: number;
}

export interface BlockListStxBlock {
  type: 'stx_block';
  height: number | string;
  hash: string;
  timestamp: number;
  txsCount?: number;
}

export interface BlockListBlock {
  type: BlockListBlockType;
  height: number | string;
  hash: string;
  timestamp: number;
  txsCount?: number;
}

