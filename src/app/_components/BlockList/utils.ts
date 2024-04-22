import { Block, BurnBlock, NakamotoBlock } from '@stacks/blockchain-api-client';

import { FADE_DURATION } from './consts';
import { BlockListBtcBlock, BlockListStxBlock } from './types';

export function createBlockListStxBlock(stxBlock: Block | NakamotoBlock): BlockListStxBlock {
  return {
    type: 'stx_block',
    height: stxBlock.height,
    hash: stxBlock.hash,
    timestamp: stxBlock.burn_block_time,
    txsCount:
      'txs' in stxBlock
        ? (stxBlock as Block).txs.length
        : 'tx_count' in stxBlock
          ? (stxBlock as NakamotoBlock).tx_count
          : 0,
  };
}
export function createBlockListBtcBlock(
  stxBlock: Block | NakamotoBlock,
  txsCount?: number
): BlockListBtcBlock {
  return {
    type: 'btc_block',
    height: stxBlock.burn_block_height,
    hash: stxBlock.burn_block_hash,
    timestamp: stxBlock.burn_block_time,
    txsCount,
  };
}

export type BtcBlockMap = Record<string, BurnBlock>;

export function getBtcTxsCount(btcBlockMap: BtcBlockMap, stxBlock: Block | NakamotoBlock) {
  const btcBlockHash = stxBlock.burn_block_hash;
  return btcBlockMap[btcBlockHash].stacks_blocks.length;
}

export type BlockListData = { stxBlocks: BlockListStxBlock[]; btcBlock: BlockListBtcBlock };

export function getApproximateStxBlocksPerMinuteFromBlockList(blockList: BlockListData[]) {
  const approximateTimeBetweenBtcBlocks = 10;
  if (!blockList || blockList.length === 0) return 0;
  const btcBlocksWithTxCounts = blockList.filter(({ btcBlock }) => !!btcBlock?.txsCount);
  const numBtcBlocks = btcBlocksWithTxCounts.length;
  const numStxBlocks = btcBlocksWithTxCounts.reduce(
    (acc, { btcBlock }) => (btcBlock?.txsCount ? acc + btcBlock?.txsCount : acc),
    0
  );
  const result = (numStxBlocks / numBtcBlocks) * approximateTimeBetweenBtcBlocks;
  return result.toFixed(0);
}

export function waitForFadeAnimation(callback: () => void) {
  setTimeout(callback, FADE_DURATION);
}

export function generateBlockList(
  stxBlocks: (Block | NakamotoBlock)[],
  btcBlocksMap?: BtcBlockMap
) {
  if (stxBlocks.length === 0) return [];
  const blockList = [
    {
      stxBlocks: [createBlockListStxBlock(stxBlocks[0])],
      btcBlock: btcBlocksMap
        ? createBlockListBtcBlock(stxBlocks[0], getBtcTxsCount(btcBlocksMap, stxBlocks[0]))
        : createBlockListBtcBlock(stxBlocks[0]),
    },
  ];
  if (stxBlocks.length === 1) return blockList;
  for (let i = 1; i < stxBlocks.length; i++) {
    const stxBlock = stxBlocks[i];
    const latestBtcBlock = blockList[blockList.length - 1].btcBlock;
    const latesStxBlocks = blockList[blockList.length - 1].stxBlocks;
    if (latestBtcBlock.hash === stxBlock.burn_block_hash) {
      latesStxBlocks.push(createBlockListStxBlock(stxBlock));
    } else {
      blockList.push({
        stxBlocks: [createBlockListStxBlock(stxBlock)],
        btcBlock: btcBlocksMap
          ? createBlockListBtcBlock(stxBlock, getBtcTxsCount(btcBlocksMap, stxBlock))
          : createBlockListBtcBlock(stxBlock),
      });
    }
  }
  return blockList;
}

export function mergeBlockLists(newblockList: BlockListData[], initialBlockList: BlockListData[]) {
  if (newblockList.length === 0) return initialBlockList;
  const earliestBtcBlock = newblockList[newblockList.length - 1];
  const latestBtcBlock = initialBlockList[0];
  if (earliestBtcBlock.btcBlock.hash === latestBtcBlock.btcBlock.hash) {
    const btcBlock = earliestBtcBlock.btcBlock || latestBtcBlock.btcBlock;
    const stxBlocks = [...earliestBtcBlock.stxBlocks, ...latestBtcBlock.stxBlocks];
    return [
      ...newblockList.slice(0, newblockList.length - 1),
      { btcBlock, stxBlocks },
      ...initialBlockList.slice(1),
    ];
  } else {
    return [...newblockList, ...initialBlockList];
  }
}
