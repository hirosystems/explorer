'use client';

import { ListFooter } from '../../../common/components/ListFooter';
import { Section } from '../../../common/components/Section';
import { SkeletonBlockList } from '../../../common/components/loaders/skeleton-text';
import { Accordion } from '../../../ui/Accordion';
import { Box } from '../../../ui/Box';
import { Flex, FlexProps } from '../../../ui/Flex';
import { FormControl } from '../../../ui/FormControl';
import { FormLabel } from '../../../ui/FormLabel';
import { Switch } from '../../../ui/Switch';
import { ExplorerErrorBoundary } from '../ErrorBoundary';
import { AnimatedBlockAndMicroblocksItem } from './AnimatedBlockAndMicroblocksItem';
import { BlockAndMicroblocksItem } from './BlockAndMicroblocksItem';
import { BlocksGroup } from './GroupedByBurnBlock/BlocksGroup';
import { BlockListProvider } from './LayoutA/Provider';
import { useBlockList2 } from './LayoutA/useBlockList copy';
import { EnhancedBlock, UIBlockType, UISingleBlock } from './types';

function BtcBlock({
  burnBlock,
  blockList,
  index
}: {
  burnBlock: UISingleBlock;
  blockList: UISingleBlock[];
  index?: number;
}) {
  return (
    <Section>
      <Box overflowX={'auto'} py={6}>
        <BlocksGroup
          burnBlock={burnBlock}
          stxBlocks={blockList}
          index={index}
          // latestBlocksCount={latestBlocksCount}
          // updateList={updateList}
        />
      </Box>
    </Section>
  );
}

function BlocksListBase({
  limit,
}: {
  limit?: number;
} & FlexProps) {
  const {
    blocks,
    blocksGroupedByBtcBlock,
    setIsGroupedByBtcBlock,
    isGroupedByBtcBlock,
    isLive,
    setIsLive,
    removeOldBlock,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useBlockList2();
  console.log('BlockList/index', { blocks, blocksGroupedByBtcBlock, blocksGroupedByBtcBlockNum: Object.keys(blocksGroupedByBtcBlock).length, isGroupedByBtcBlock, isLive });

  if ((isGroupedByBtcBlock && Object.keys(blocksGroupedByBtcBlock).length === 0) || !blocks?.length)
    return <SkeletonBlockList />;

  return (
    <Section
      gridColumnStart={['1', '1', '1', '2']}
      gridColumnEnd={['2', '2', '2', '3']}
      minWidth={0}
      flexGrow={0}
      flexShrink={1}
      title={
        <FormControl display="flex" alignItems="center">
          <Flex gap={2}>
            <Flex gap={1} alignItems="center">
              <FormLabel htmlFor="blocks-live-view-switch" mb="0" color="secondaryText">
                Group by Bitcoin block
              </FormLabel>
              <Switch
                id="blocks-live-view-switch"
                isChecked={isGroupedByBtcBlock}
                onChange={() => setIsGroupedByBtcBlock(!isGroupedByBtcBlock)}
              />
            </Flex>
            <Flex gap={1} alignItems="center">
              <FormLabel htmlFor="blocks-live-view-switch" mb="0" color="secondaryText">
                Live Updates
              </FormLabel>
              <Switch
                id="blocks-live-view-switch"
                isChecked={isLive}
                onChange={() => setIsLive(!isLive)}
              />
            </Flex>
          </Flex>
        </FormControl>
      }
    >
      <Flex flexDirection="column" pb={6} pt={6} gap={6}>
        <Accordion allowMultiple>
          {!isGroupedByBtcBlock ? (
            (blocks as EnhancedBlock[])?.map(block =>
              isLive ? (
                <AnimatedBlockAndMicroblocksItem
                  block={block}
                  key={block.hash}
                  onAnimationExit={() => removeOldBlock(block)}
                />
              ) : (
                <BlockAndMicroblocksItem block={block} key={block.hash} />
              )
            )
          ) : (
            <Flex flexDirection="column" gap={6}>
              {Object.entries(blocksGroupedByBtcBlock).map(([burnBlockHeight, stxBlocks], index) => {
                const stxBlock = blocksGroupedByBtcBlock[burnBlockHeight][0];
                const burnBlock: UISingleBlock = {
                  type: UIBlockType.BurnBlock,
                  height: stxBlock.burn_block_height,
                  hash: stxBlock.burn_block_hash,
                  timestamp: stxBlock.burn_block_time,
                };
                return (
                  <BtcBlock
                    key={stxBlock.burn_block_hash}
                    index={index}
                    burnBlock={burnBlock}
                    blockList={stxBlocks.map(
                      block =>
                        ({
                          type: UIBlockType.Block,
                          height: block.height,
                          hash: block.hash,
                          timestamp: block.burn_block_time,
                          txsCount: block.txs.length,
                        }) as UISingleBlock
                    )}
                  />
                );
              })}
            </Flex>
          )}
        </Accordion>
        {!isLive && (
          <ListFooter
            isLoading={isFetchingNextPage}
            hasNextPage={hasNextPage}
            href={limit ? '/blocks' : undefined}
            fetchNextPage={limit ? undefined : fetchNextPage}
            label={'blocks'}
          />
        )}
      </Flex>
    </Section>
  );
}

export function BlocksList({ limit }: { limit?: number }) {
  return (
    <ExplorerErrorBoundary
      Wrapper={Section}
      wrapperProps={{
        title: 'Recent Blocks',
        gridColumnStart: ['1', '1', '2'],
        gridColumnEnd: ['2', '2', '3'],
        minWidth: 0,
      }}
      tryAgainButton
    >
      <BlockListProvider>
        <BlocksListBase limit={limit} />
      </BlockListProvider>
    </ExplorerErrorBoundary>
  );
}
