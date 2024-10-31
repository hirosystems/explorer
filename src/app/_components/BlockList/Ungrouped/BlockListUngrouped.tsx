import { useColorModeValue } from '@chakra-ui/react';
import { ArrowBendDownLeft, Clock } from '@phosphor-icons/react';
import React, { ReactNode, useCallback, useMemo, useState } from 'react';

import { Block, NakamotoBlock } from '@stacks/blockchain-api-client';

import { BlockLink, ExplorerLink } from '../../../../common/components/ExplorerLinks';
import { Timestamp } from '../../../../common/components/Timestamp';
import { mobileBorderCss } from '../../../../common/constants/constants';
import { useInfiniteQueryResult } from '../../../../common/hooks/useInfiniteQueryResult';
import { useBlocksByBurnBlock } from '../../../../common/queries/useBlocksByBurnBlock';
import { truncateMiddle } from '../../../../common/utils/utils';
import { Box } from '../../../../ui/Box';
import { Flex, FlexProps } from '../../../../ui/Flex';
import { Grid } from '../../../../ui/Grid';
import { HStack } from '../../../../ui/HStack';
import { Icon } from '../../../../ui/Icon';
import { Stack } from '../../../../ui/Stack';
import { Text } from '../../../../ui/Text';
import BitcoinIcon from '../../../../ui/icons/BitcoinIcon';
import StxIcon from '../../../../ui/icons/StxIcon';
import { ListHeader } from '../../ListHeader';
import { BlockCount } from '../BlockCount';
import { useBlockListContext } from '../BlockListContext';
import { LineAndNode } from '../LineAndNode';
import { ScrollableBox } from '../ScrollableDiv';
import { getFadeAnimationStyle } from '../consts';
import { BlockListStxBlock } from '../types';
import { BlockListData, createBlockListStxBlock } from '../utils';

interface BtcBlockRowProps {
  height: number | string;
  hash: string;
  timestamp?: number;
  isFirst: boolean;
}
export function BtcBlockRowLayout({ children, ...rest }: FlexProps & { children: ReactNode }) {
  const textColor = useColorModeValue('slate.700', 'slate.500');
  return (
    <Flex
      justifyContent="space-between"
      alignItems="center"
      px={6}
      mx={-6}
      height={14}
      backgroundColor="surfaceHighlight"
      color={textColor}
      {...rest}
    >
      {children}
    </Flex>
  );
}

export function BtcBlockRowContent({ timestamp, height, hash, isFirst }: BtcBlockRowProps) {
  const iconColor = useColorModeValue('slate.600', 'slate.800'); // TODO: not in theme. remove
  return (
    <>
      <HStack gap={1.5}>
        <Icon
          as={ArrowBendDownLeft}
          transform={'rotate(90deg)'}
          size={2.5}
          color={iconColor}
          position={'relative'}
          bottom={'1px'}
        />
        <Icon as={BitcoinIcon} size={18} position={'relative'} bottom={'1px'} />
        {isFirst ? (
          <Text fontSize="sm" color="textSubdued" fontWeight="medium">
            Next Bitcoin block
          </Text>
        ) : (
          <ExplorerLink fontSize="sm" color={'textSubdued'} href={`/btcblock/${hash}`}>
            #{height}
          </ExplorerLink>
        )}
      </HStack>
      <Box>
        {isFirst ? (
          <Flex gap={1} alignItems="center">
            <Icon as={Clock} size={4} color="iconSubdued" />
            <Text color="textSubdued" fontSize="xs">
              Unconfirmed
            </Text>
          </Flex>
        ) : (
          <HStack divider={<>&nbsp;∙&nbsp;</>} fontSize={'xs'}>
            <ExplorerLink
              fontSize="xs"
              color={'textSubdued'}
              href={`/btcblock/${hash}`}
              whiteSpace={'nowrap'}
            >
              {truncateMiddle(hash, 6)}
            </ExplorerLink>
            {timestamp && <Timestamp ts={timestamp} />}
          </HStack>
        )}
      </Box>
    </>
  );
}

export function BtcBlockRow({ timestamp, height, hash, isFirst }: BtcBlockRowProps) {
  return (
    <BtcBlockRowLayout>
      <BtcBlockRowContent timestamp={timestamp} height={height} hash={hash} isFirst={isFirst} />
    </BtcBlockRowLayout>
  );
}

const GroupHeader = () => {
  return (
    <>
      <Box
        position={'sticky'}
        left={0}
        zIndex={'docked'}
        bg={'surface'}
        pr={4}
        sx={mobileBorderCss}
      >
        <ListHeader width="fit-content" bg="hoverBackground">
          Block height
        </ListHeader>{' '}
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

function StxBlockRow({
  height,
  hash,
  timestamp,
  txsCount,
  minimized,
  isFirst,
  isLast,
}: {
  height: number | string;
  hash: string;
  timestamp: number;
  txsCount?: number;
  minimized?: boolean;
  isFirst?: boolean;
  isLast?: boolean;
}) {
  const icon = isFirst ? <Icon as={StxIcon} size={2.5} color={'white'} /> : null;
  return minimized ? (
    <>
      <Flex
        position="sticky"
        left={0}
        alignItems="center"
        gridColumn="1 / 2"
        gap={2}
        sx={mobileBorderCss}
        zIndex="docked"
        bg="surface"
      >
        <LineAndNode rowHeight={14} width={6} icon={icon} isLast={isLast} />
        <BlockLink hash={hash}>
          <Text fontSize="sm" color="text" fontWeight="medium">
            #{height}
          </Text>
        </BlockLink>
      </Flex>

      <HStack
        divider={<>&nbsp;∙&nbsp;</>}
        gap={1}
        whiteSpace="nowrap"
        color="textSubdued"
        gridColumn="3 / 4"
        justifyContent="flex-end"
      >
        <BlockLink hash={hash}>
          <Text color="textSubdued" fontWeight="medium" fontSize="xs" whiteSpace="nowrap">
            {truncateMiddle(hash, 3)}
          </Text>
        </BlockLink>
        {txsCount !== undefined ? (
          <Text color="textSubdued" fontWeight="medium" fontSize="xs">
            {txsCount || 0} txn
          </Text>
        ) : null}
        <Timestamp ts={timestamp} />
      </HStack>
    </>
  ) : (
    <>
      <Flex
        alignItems="center"
        gap={2}
        position="sticky"
        left={0}
        sx={mobileBorderCss}
        zIndex="docked"
        bg="surface"
      >
        <LineAndNode rowHeight={14} width={6} icon={icon} isLast={isLast} />
        <BlockLink hash={hash}>
          <Text fontSize="sm" color="text" fontWeight="medium">
            #{height}
          </Text>
        </BlockLink>
      </Flex>

      <Flex alignItems="center">
        <BlockLink hash={hash}>
          <Text color="text" fontWeight={'medium'} fontSize={'xs'}>
            {hash}
          </Text>
        </BlockLink>
      </Flex>

      <Flex alignItems="center">
        <Text color="text" fontWeight={'medium'} fontSize={'xs'}>
          {txsCount}
        </Text>
      </Flex>

      <Flex alignItems="center">
        <Timestamp ts={timestamp} />
      </Flex>
    </>
  );
}

export function StxBlocksGridLayout({
  children,
  minimized,
}: {
  children: ReactNode;
  minimized?: boolean;
}) {
  return (
    <Grid
      templateColumns={minimized ? 'auto 1fr auto' : 'repeat(4, 1fr)'}
      width={'full'}
      columnGap={minimized ? 0 : 4}
    >
      {children}
    </Grid>
  );
}

function StxBlocksGrid({
  blocksCount,
  stxBlocks,
  lastStxBlock,
  stxBlocksLimit,
  minimized = false,
  isFirst,
  loadMoreStxBlocksHandler,
}: {
  stxBlocks: BlockListStxBlock[];
  lastStxBlock: BlockListStxBlock | null;
  stxBlocksLimit?: number;
  blocksCount: number;
  minimized?: boolean;
  isFirst: boolean;
  loadMoreStxBlocksHandler?: () => void;
}) {
  const stxBlocksToDisplay = useMemo(
    () => (stxBlocksLimit ? stxBlocks.slice(0, stxBlocksLimit) : stxBlocks),
    [stxBlocks, stxBlocksLimit]
  );
  const numStxBlocksNotDisplayed = blocksCount - stxBlocksToDisplay.length;
  const showLastStxBlock = lastStxBlock && numStxBlocksNotDisplayed > 1;

  return (
    <Stack gap={0}>
      <StxBlocksGridLayout minimized={minimized}>
        {minimized ? null : <GroupHeader />}
        {stxBlocksToDisplay.map((stxBlock, i) => (
          <React.Fragment key={`stx-block-row-${stxBlock.hash}`}>
            <StxBlockRow
              height={stxBlock.height}
              hash={stxBlock.hash}
              timestamp={stxBlock.timestamp}
              txsCount={stxBlock.txsCount}
              minimized={minimized}
              isFirst={i === 0}
              isLast={i === stxBlocksToDisplay.length - 1 && numStxBlocksNotDisplayed <= 0}
            />
            {i < stxBlocksToDisplay.length - 1 && (
              <Box gridColumn={'1/5'} borderBottom={'1px'} borderColor="borderSecondary"></Box>
            )}
          </React.Fragment>
        ))}
      </StxBlocksGridLayout>
      {numStxBlocksNotDisplayed > 0 ? (
        <Box py={2}>
          <BlockCount
            count={showLastStxBlock ? numStxBlocksNotDisplayed - 1 : numStxBlocksNotDisplayed}
            isFirst={isFirst}
            minimized={minimized}
            loadMoreStxBlocksHandler={loadMoreStxBlocksHandler}
          />
        </Box>
      ) : null}
      {showLastStxBlock ? (
        <StxBlocksGridLayout minimized={minimized}>
          <StxBlockRow
            height={lastStxBlock.height}
            hash={lastStxBlock.hash}
            timestamp={lastStxBlock.timestamp}
            minimized={minimized}
            isFirst={false}
            isLast={true}
          />
        </StxBlocksGridLayout>
      ) : null}
    </Stack>
  );
}

function StxBlocksGroupedByBtcBlock({
  blockList,
  stxBlocksLimit,
  minimized = false,
  isFirst,
}: {
  blockList: BlockListData;
  stxBlocksLimit?: number;
  minimized?: boolean;
  isFirst: boolean;
}) {
  const btcBlock = blockList.btcBlock;
  const stxBlocks = blockList.stxBlocks;

  const [enabled, setEnabled] = useState(false);

  const response = useBlocksByBurnBlock(
    btcBlock.height,
    stxBlocksLimit,
    stxBlocks.length,
    {
      enabled,
    },
    'additional-stx-blocks-loaded'
  );
  const { fetchNextPage, hasNextPage } = response;
  const additionalStxBlocks = useInfiniteQueryResult<Block | NakamotoBlock>(response);

  const handleLoadMoreStxBlocks = useCallback(() => {
    // TODO: remove this comment
    setEnabled(true);
    if (hasNextPage) {
      fetchNextPage();
    }
  }, [fetchNextPage, hasNextPage]);

  const allStxBlocks = useMemo(() => {
    return stxBlocks.concat(additionalStxBlocks.map(createBlockListStxBlock));
  }, [stxBlocks, additionalStxBlocks]);

  // Live updates cause unaccounted blocks and txs
  const unaccountedStxBlocks = useMemo(
    () => Math.max(0, allStxBlocks.length - btcBlock.blockCount),
    [allStxBlocks, btcBlock.blockCount]
  );
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
    <Box mt={4}>
      <ScrollableBox>
        <StxBlocksGrid
          blocksCount={blocksCount}
          stxBlocks={allStxBlocks}
          lastStxBlock={lastStxBlockFormatted}
          minimized={minimized}
          isFirst={isFirst}
          stxBlocksLimit={stxBlocksLimit}
          loadMoreStxBlocksHandler={handleLoadMoreStxBlocks}
        />
      </ScrollableBox>
      <BtcBlockRow
        hash={btcBlock.hash}
        height={btcBlock.height}
        timestamp={btcBlock.timestamp}
        isFirst={isFirst}
      />
    </Box>
  );
}

export function BlockListUngroupedLayout({ children }: { children: ReactNode }) {
  const { isBlockListLoading } = useBlockListContext();

  return (
    <Stack width={'full'} style={getFadeAnimationStyle(isBlockListLoading)}>
      {children}
    </Stack>
  );
}

export function BlockListUngrouped({
  blockList,
  stxBlocksLimit,
  minimized = false,
}: {
  blockList: BlockListData[];
  stxBlocksLimit?: number;
  minimized?: boolean;
}) {
  return (
    <BlockListUngroupedLayout>
      {blockList.map((bl, i) => (
        <StxBlocksGroupedByBtcBlock
          key={`stx-blocks-grouped-by-btc-block-${bl.btcBlock.hash}`}
          blockList={bl}
          stxBlocksLimit={stxBlocksLimit}
          minimized={minimized}
          isFirst={i === 0}
        />
      ))}
    </BlockListUngroupedLayout>
  );
}
