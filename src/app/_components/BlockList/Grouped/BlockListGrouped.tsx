import { ArrowElbowLeftDown } from '@phosphor-icons/react';
import React, { ReactNode, useCallback, useMemo, useState } from 'react';

import { Block, NakamotoBlock } from '@stacks/blockchain-api-client';

import { BlockLink, ExplorerLink } from '../../../../common/components/ExplorerLinks';
import { Timestamp } from '../../../../common/components/Timestamp';
import { mobileBorderCss } from '../../../../common/constants/constants';
import { useInfiniteQueryResult } from '../../../../common/hooks/useInfiniteQueryResult';
import { useBlocksByBurnBlock } from '../../../../common/queries/useBlocksByBurnBlock';
import { truncateMiddle } from '../../../../common/utils/utils';
import { Box } from '../../../../ui/Box';
import { Flex } from '../../../../ui/Flex';
import { Grid } from '../../../../ui/Grid';
import { HStack } from '../../../../ui/HStack';
import { Icon } from '../../../../ui/Icon';
import { Stack } from '../../../../ui/Stack';
import { Text } from '../../../../ui/Text';
import BitcoinIcon from '../../../../ui/icons/BitcoinIcon';
import StxIcon from '../../../../ui/icons/StxIcon';
import { Caption } from '../../../../ui/typography';
import { ListHeader } from '../../ListHeader';
import { BlockCount } from '../BlockCount';
import { useBlockListContext } from '../BlockListContext';
import { LineAndNode } from '../LineAndNode';
import { ScrollableBox } from '../ScrollableDiv';
import { getFadeAnimationStyle } from '../consts';
import { BlockListBtcBlock, BlockListStxBlock } from '../types';
import { BlockListData, createBlockListStxBlock } from '../utils';

const PADDING = 4;

const GroupHeader = () => {
  return (
    <>
      <Box position="sticky" left={0} bg="surface" pr={4} sx={mobileBorderCss}>
        <ListHeader width="fit-content" bg="hoverBackground">
          Block height
        </ListHeader>
      </Box>
      <Box>
        <ListHeader width="fit-content" bg="hoverBackground">
          Block hash
        </ListHeader>
      </Box>
      <Box>
        <ListHeader width="fit-content" bg="hoverBackground">
          Transactions
        </ListHeader>
      </Box>
      <Box>
        <ListHeader width="fit-content" bg="hoverBackground">
          Timestamp
        </ListHeader>
      </Box>
    </>
  );
};

const StxBlockRow = ({
  stxBlock,
  minimized = false,
  isFirst,
  isLast,
}: {
  stxBlock: BlockListStxBlock;
  minimized?: boolean;
  isFirst?: boolean;
  isLast?: boolean;
}) => {
  const icon = isFirst ? <Icon as={StxIcon} size={2.5} color={'white'} /> : undefined;
  return minimized ? (
    <>
      <Flex
        position="sticky"
        left={0}
        gap={2}
        fontSize="sm"
        sx={mobileBorderCss}
        gridColumn="1 / 2"
        alignItems="center"
        zIndex="docked"
        bg="surface"
      >
        <LineAndNode rowHeight={14} width={6} icon={icon} isLast={isLast} />
        <BlockLink hash={stxBlock.hash}>
          <Text color="text" fontWeight="medium" fontSize="sm">
            #{stxBlock.height}
          </Text>
        </BlockLink>
      </Flex>

      <HStack
        divider={<Caption>∙</Caption>}
        gap={1}
        whiteSpace="nowrap"
        gridColumn="3 / 4"
        justifyContent="flex-end"
      >
        <BlockLink hash={stxBlock.hash}>
          <Text color="textSubdued" fontWeight="medium" fontSize="xs" whiteSpace="nowrap">
            {truncateMiddle(stxBlock.hash, 3)}
          </Text>
        </BlockLink>
        {stxBlock.txsCount !== undefined ? (
          <Text color="textSubdued" fontWeight="medium" fontSize="xs">
            {stxBlock.txsCount || 0} txn
          </Text>
        ) : null}
        <Timestamp ts={stxBlock.timestamp} />
      </HStack>
    </>
  ) : (
    <>
      <Flex
        position="sticky"
        left={0}
        zIndex="docked"
        bg="surface"
        gap={2}
        fontSize="sm"
        sx={mobileBorderCss}
        alignItems="center"
      >
        <LineAndNode rowHeight={14} width={6} icon={icon} isLast={isLast} />
        <BlockLink hash={stxBlock.hash}>
          <Text color="text" fontWeight="medium" fontSize="sm">
            #{stxBlock.height}
          </Text>
        </BlockLink>
      </Flex>

      <Flex alignItems="center">
        <BlockLink hash={stxBlock.hash}>
          <Text color="text" fontWeight="medium" fontSize="xs">
            {stxBlock.hash}
          </Text>
        </BlockLink>
      </Flex>

      <Flex alignItems="center">
        <Text color="text" fontWeight="medium" fontSize="xs">
          {stxBlock.txsCount}
        </Text>
      </Flex>

      <Flex alignItems="center">
        <Timestamp ts={stxBlock.timestamp} />
      </Flex>
    </>
  );
};

export function BurnBlockGroupGridLayout({
  minimized,
  children,
}: {
  minimized?: boolean;
  children: ReactNode;
}) {
  return (
    <Grid
      templateColumns={minimized ? 'auto 1fr auto' : 'repeat(4, 1fr)'}
      width={'full'}
      columnGap={minimized ? 0 : 4}
      mb="1px"
    >
      {children}
    </Grid>
  );
}

export function BurnBlockGroupGrid({
  blocksCount,
  stxBlocks,
  lastStxBlock = null,
  stxBlocksLimit,
  minimized = false,
  isFirst = false,
  loadMoreStxBlocksHandler,
  displayBlocksCount = true,
}: {
  stxBlocks: BlockListStxBlock[];
  blocksCount: number;
  lastStxBlock?: BlockListStxBlock | null;
  stxBlocksLimit?: number;
  isFirst?: boolean;
  minimized?: boolean;
  loadMoreStxBlocksHandler?: () => void;
  displayBlocksCount?: boolean;
}) {
  const stxBlocksToDisplay = useMemo(
    () => (stxBlocksLimit ? stxBlocks.slice(0, stxBlocksLimit) : stxBlocks),
    [stxBlocks, stxBlocksLimit]
  );
  const numStxBlocksNotDisplayed = blocksCount - stxBlocksToDisplay.length;
  const showLastStxBlock = lastStxBlock && numStxBlocksNotDisplayed > 1;

  return (
    <Stack gap={0}>
      <BurnBlockGroupGridLayout minimized={minimized}>
        {minimized || stxBlocksToDisplay.length === 0 ? null : <GroupHeader />}
        {stxBlocksToDisplay.map((stxBlock, i) => (
          <React.Fragment key={`stx-block-row-${stxBlock.hash}`}>
            <StxBlockRow
              stxBlock={stxBlock}
              minimized={minimized}
              isFirst={i === 0}
              isLast={i === stxBlocksToDisplay.length - 1 && numStxBlocksNotDisplayed <= 0}
            />
            {i < stxBlocksToDisplay.length - 1 && (
              <Box gridColumn={'1/5'} borderBottom={'1px'} borderColor="borderSecondary"></Box>
            )}
          </React.Fragment>
        ))}
      </BurnBlockGroupGridLayout>
      {displayBlocksCount && numStxBlocksNotDisplayed > 0 ? (
        <Box py={2}>
          <BlockCount
            count={showLastStxBlock ? numStxBlocksNotDisplayed - 1 : numStxBlocksNotDisplayed}
            isFirst={isFirst}
            loadMoreStxBlocksHandler={loadMoreStxBlocksHandler}
            minimized={minimized}
          />
        </Box>
      ) : null}
      {showLastStxBlock ? (
        <BurnBlockGroupGridLayout minimized={minimized}>
          <StxBlockRow
            stxBlock={lastStxBlock}
            minimized={minimized}
            isFirst={false}
            isLast={true}
          />
        </BurnBlockGroupGridLayout>
      ) : null}
    </Stack>
  );
}

function BitcoinHeader({
  btcBlock,
  minimized = false,
  isFirst,
}: {
  btcBlock: BlockListBtcBlock;
  minimized?: boolean;
  isFirst: boolean;
}) {
  return (
    <Flex
      alignItems={'center'}
      justifyContent={minimized ? 'space-between' : 'normal'}
      gap={1.5}
      pb={3}
      marginX={-PADDING}
      px={PADDING}
      borderBottom={minimized ? '1px solid var(--stacks-colors-borderPrimary)' : 'none'}
      flexWrap={'wrap'}
    >
      <Flex alignItems={'center'} gap={1.5} flexWrap={'nowrap'}>
        <Icon as={ArrowElbowLeftDown} size={3.5} color="textSubdued" />
        <Icon as={BitcoinIcon} size={4.5} />
        <Flex height="full" alignItems="center">
          <ExplorerLink
            fontSize="sm"
            color="textSubdued"
            href={`/btcblock/${btcBlock.hash}`}
            height="full"
          >
            #{btcBlock.height}
          </ExplorerLink>
        </Flex>
      </Flex>
      <Box>
        <HStack divider={<Caption>∙</Caption>} gap={1} flexWrap={'wrap'}>
          <ExplorerLink
            fontSize="xs"
            color="textSubdued"
            href={`/btcblock/${btcBlock.hash}`}
            whiteSpace={'nowrap'}
          >
            {truncateMiddle(btcBlock.hash, 6)}
          </ExplorerLink>
          <Timestamp ts={btcBlock.timestamp} whiteSpace={'nowrap'} />
        </HStack>
      </Box>
    </Flex>
  );
}

export function Footer({
  txsCount,
  blocksCount,
}: {
  txsCount: number | undefined;
  blocksCount: number | undefined;
}) {
  return (
    <Box borderTop="1px solid var(--stacks-colors-borderSecondary)">
      <HStack divider={<Caption>∙</Caption>} gap={1} pt={4} flexWrap="wrap">
        <Text color="textSubdued" fontSize="xs" whiteSpace="nowrap">
          {blocksCount ? blocksCount : '-'} blocks
        </Text>
        <Text color="textSubdued" fontSize="xs" whiteSpace="nowrap">
          {txsCount ? txsCount : '-'} transactions
        </Text>
      </HStack>
    </Box>
  );
}

export function BurnBlockGroup({
  btcBlock,
  stxBlocks,
  isFirst,
  stxBlocksLimit,
  minimized = false,
}: {
  btcBlock: BlockListBtcBlock;
  stxBlocks: BlockListStxBlock[];
  isFirst: boolean;
  stxBlocksLimit?: number;
  minimized?: boolean;
}) {
  const [enabled, setEnabled] = useState(false);

  const response = useBlocksByBurnBlock(
    btcBlock.height,
    10,
    stxBlocks.length,
    {
      enabled,
    },
    'additional-stx-blocks-loaded'
  );
  const { fetchNextPage, hasNextPage } = response;
  const additionalStxBlocksLoaded = useInfiniteQueryResult<Block | NakamotoBlock>(response);

  const handleLoadMoreStxBlocks = useCallback(() => {
    setEnabled(true);
    if (hasNextPage) {
      fetchNextPage();
    }
  }, [fetchNextPage, hasNextPage]);

  const allStxBlocks = useMemo(() => {
    return stxBlocks.concat(additionalStxBlocksLoaded.map(createBlockListStxBlock));
  }, [stxBlocks, additionalStxBlocksLoaded]);

  // Live updates cause unaccounted blocks and txs
  const unaccountedStxBlocks = useMemo(
    () => Math.max(0, allStxBlocks.length - btcBlock.blockCount),
    [allStxBlocks, btcBlock.blockCount]
  );
  const unaccountedTxs = useMemo(
    () =>
      unaccountedStxBlocks > 0
        ? allStxBlocks
            .slice(0, unaccountedStxBlocks)
            .reduce((acc, block) => acc + (block.txsCount || 0), 0)
        : 0,
    [allStxBlocks, unaccountedStxBlocks]
  );

  const txsCount = isFirst
    ? btcBlock.txsCount + unaccountedTxs // For the first btc block, if live is on, then the btc block tx count can be stale and we need to account for the unaccounted txs
    : btcBlock.txsCount;
  const blocksCount = useMemo(
    () => (isFirst ? btcBlock.blockCount + unaccountedStxBlocks : btcBlock.blockCount),
    [btcBlock, unaccountedStxBlocks, isFirst]
  );

  const queryForLastStxBlockRequired = useMemo(
    () => allStxBlocks.length < blocksCount,
    [allStxBlocks, blocksCount]
  );
  const lastStxBlockResponse = useBlocksByBurnBlock(
    btcBlock.height,
    1,
    blocksCount - 1,
    {
      enabled: queryForLastStxBlockRequired,
    },
    'last-stx-block'
  );
  const lastStxBlock = useInfiniteQueryResult<Block | NakamotoBlock>(lastStxBlockResponse)[0];
  const lastStxBlockFormatted = useMemo(
    () => (lastStxBlock ? createBlockListStxBlock(lastStxBlock) : null),
    [lastStxBlock]
  );

  return (
    <Box border={'1px'} rounded={'lg'} p={PADDING}>
      <BitcoinHeader btcBlock={btcBlock} minimized={minimized} isFirst={isFirst} />
      <ScrollableBox>
        <BurnBlockGroupGrid
          stxBlocks={allStxBlocks}
          blocksCount={blocksCount}
          lastStxBlock={lastStxBlockFormatted}
          stxBlocksLimit={stxBlocksLimit}
          minimized={minimized}
          isFirst={isFirst}
          loadMoreStxBlocksHandler={handleLoadMoreStxBlocks}
        />
      </ScrollableBox>
      <Footer txsCount={txsCount} blocksCount={blocksCount} />
    </Box>
  );
}

export function BlockListGroupedLayout({ children }: { children: ReactNode }) {
  const { isBlockListLoading } = useBlockListContext();

  return (
    <Stack gap={4} width={'full'} style={getFadeAnimationStyle(isBlockListLoading)}>
      {children}
    </Stack>
  );
}

export function BlockListGrouped({
  blockList,
  minimized,
  stxBlocksLimit,
}: {
  blockList: BlockListData[];
  minimized: boolean;
  stxBlocksLimit?: number;
}) {
  return (
    <BlockListGroupedLayout>
      {blockList.map((block, i) => (
        <BurnBlockGroup
          key={`burn-block-group-${block.btcBlock.hash}`}
          btcBlock={block.btcBlock}
          stxBlocks={block.stxBlocks}
          minimized={minimized}
          stxBlocksLimit={stxBlocksLimit}
          isFirst={i === 0}
        />
      ))}
    </BlockListGroupedLayout>
  );
}
