import { Block, BurnBlock, NakamotoBlock } from '@stacks/blockchain-api-client';

import { FADE_DURATION } from './consts';
import { BlockListBtcBlock, BlockListStxBlock } from './types';

export type BtcBlockMap = Record<string, BurnBlock>;

export type BlockListData = { stxBlocks: BlockListStxBlock[]; btcBlock: BlockListBtcBlock };

export function createBlockListStxBlock(stxBlock: Block | NakamotoBlock): BlockListStxBlock {
  return {
    type: 'stx_block',
    height: stxBlock.height,
    hash: stxBlock.hash,
    timestamp: stxBlock?.block_time,
    txsCount:
      'txs' in stxBlock
        ? (stxBlock as Block).txs?.length || 0
        : 'tx_count' in stxBlock
          ? (stxBlock as NakamotoBlock).tx_count
          : 0,
  };
}
export function createBlockListBtcBlock(btcBlock: BurnBlock): BlockListBtcBlock {
  return {
    type: 'btc_block',
    height: btcBlock.burn_block_height,
    hash: btcBlock.burn_block_hash,
    timestamp: btcBlock.burn_block_time,
    txsCount: btcBlock.total_tx_count,
    blockCount: btcBlock.stacks_blocks.length,
    avgBlockTime: btcBlock.avg_block_time,
  };
}

export function createBlockListBtcBlockFromStxBlock(
  stxBlock: Block | NakamotoBlock
): BlockListBtcBlock {
  return {
    type: 'btc_block',
    height: stxBlock.burn_block_height,
    hash: stxBlock.burn_block_hash,
    timestamp: stxBlock.burn_block_time,
    txsCount: 0,
    blockCount: 0,
    avgBlockTime: 0,
  };
}

export function getApproximateStxBlocksPerMinuteFromBlockList(blockList: BlockListData[]) {
  const approximateTimeBetweenBtcBlocks = 10;
  if (!blockList || blockList.length === 0) return '0';
  const btcBlocksWithTxCounts = blockList.filter(({ btcBlock }) => !!btcBlock?.txsCount);
  const numBtcBlocks = btcBlocksWithTxCounts.length;
  const numStxBlocks = btcBlocksWithTxCounts.reduce(
    (acc, { btcBlock }) => (btcBlock?.txsCount ? acc + btcBlock?.txsCount : acc),
    0
  );
  if (numStxBlocks === 0) return '0';
  const result = (numStxBlocks / numBtcBlocks) * approximateTimeBetweenBtcBlocks;
  return result.toFixed(0);
}

export function waitForFadeAnimation(callback: () => void) {
  setTimeout(callback, FADE_DURATION);
}

export function generateBlockList(
  stxBlocks: (Block | NakamotoBlock)[],
  btcBlocksMap: BtcBlockMap
): BlockListData[] {
  if (stxBlocks.length === 0 || Object.keys(btcBlocksMap).length === 0) return [];

  const firstStxBlock = stxBlocks[0];
  const firstBtcBlock = btcBlocksMap[firstStxBlock.burn_block_hash];
  const blockList = [
    {
      stxBlocks: [createBlockListStxBlock(firstStxBlock)],
      btcBlock: firstBtcBlock
        ? createBlockListBtcBlock(firstBtcBlock)
        : createBlockListBtcBlockFromStxBlock(firstStxBlock),
    },
  ];

  if (stxBlocks.length === 1) return blockList;

  for (let i = 1; i < stxBlocks.length; i++) {
    const stxBlock = stxBlocks[i];
    const latestBtcBlock = blockList[blockList.length - 1].btcBlock;
    const latestStxBlocks = blockList[blockList.length - 1].stxBlocks;
    if (latestBtcBlock.hash === stxBlock.burn_block_hash) {
      latestStxBlocks.push(createBlockListStxBlock(stxBlock));
    } else {
      const btcBlock = btcBlocksMap[stxBlock.burn_block_hash];
      blockList.push({
        stxBlocks: [createBlockListStxBlock(stxBlock)],
        btcBlock: btcBlock
          ? createBlockListBtcBlock(btcBlock)
          : createBlockListBtcBlockFromStxBlock(stxBlock),
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

// export function mergeStxBlockLists(newblockList: BlockListStxBlock[], initialBlockList: BlockListStxBlock[]) {
//   if (newblockList.length === 0) return initialBlockList;
//   const earliestStxBlock = newblockList[newblockList.length - 1];
//   const latestStxBlock = initialBlockList[0];
//   if (earliestStxBlock.hash === latestStxBlock.hash) {
//     const btcBlock = earliestStxBlock.btcBlock || latestStxBlock.btcBlock;
//     const stxBlocks = [...earliestStxBlock.stxBlocks, ...latestStxBlock.stxBlocks];
//     return [
//       ...newblockList.slice(0, newblockList.length - 1),
//       { btcBlock, stxBlocks },
//       ...initialBlockList.slice(1),
//     ];
//   } else {
//     return [...newblockList, ...initialBlockList];
//   }
// }
