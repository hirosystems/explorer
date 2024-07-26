import { ArrowElbowLeftDown, Clock } from '@phosphor-icons/react';
import React, { ReactNode, useMemo } from 'react';

import { BlockLink, ExplorerLink } from '../../../../common/components/ExplorerLinks';
import { Timestamp } from '../../../../common/components/Timestamp';
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
import { getFadeAnimationStyle, mobileBorderCss } from '../consts';
import { BlockListBtcBlock, BlockListStxBlock } from '../types';
import { BlockListData } from '../utils';

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
        <Timestamp timestampInMs={stxBlock.timestamp} />
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
        <Timestamp timestampInMs={stxBlock.timestamp} />
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
    >
      {children}
    </Grid>
  );
}

export function BurnBlockGroupGrid({
  stxBlocks,
  minimized,
  numStxBlocksNotDisplayed,
}: {
  stxBlocks: BlockListStxBlock[];
  minimized: boolean;
  numStxBlocksNotDisplayed: number;
}) {
  return (
    <BurnBlockGroupGridLayout minimized={minimized}>
      {minimized || stxBlocks.length === 0 ? null : <GroupHeader />}
      {stxBlocks.map((stxBlock, i) => (
        <React.Fragment key={`stx-block-row-${stxBlock.hash}`}>
          <StxBlockRow
            stxBlock={stxBlock}
            minimized={minimized}
            isFirst={i === 0}
            isLast={i === stxBlocks.length - 1 && numStxBlocksNotDisplayed <= 0}
          />
          {i < stxBlocks.length - 1 && (
            <Box gridColumn={'1/5'} borderBottom={'1px'} borderColor="borderSecondary"></Box>
          )}
        </React.Fragment>
      ))}
    </BurnBlockGroupGridLayout>
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
      // height={5}
    >
      <Flex alignItems={'center'} gap={1.5} flexWrap={'nowrap'}>
        <Icon as={ArrowElbowLeftDown} size={3.5} color="textSubdued" />
        <Icon as={BitcoinIcon} size={4.5} />
        {isFirst ? (
          <Flex height="full" alignItems="center">
            <Text fontSize="sm" color="textSubdued">
              Next Bitcoin block
            </Text>
          </Flex>
        ) : (
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
        )}
      </Flex>
      <Box>
        {isFirst ? (
          <Flex gap={1} alignItems="center">
            <Icon as={Clock} size={4} color="iconSubdued" />
            <Text color="textSubdued" fontSize="xs">
              Unconfirmed
            </Text>
          </Flex>
        ) : (
          <HStack divider={<Caption>∙</Caption>} gap={1} flexWrap={'wrap'}>
            <ExplorerLink
              fontSize="xs"
              color="textSubdued"
              href={`/btcblock/${btcBlock.hash}`}
              whiteSpace={'nowrap'}
            >
              {truncateMiddle(btcBlock.hash, 6)}
            </ExplorerLink>
            <Timestamp timestampInMs={btcBlock.timestamp} whiteSpace={'nowrap'} />
          </HStack>
        )}
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
  onlyShowStxBlocksForFirstBtcBlock,
}: {
  btcBlock: BlockListBtcBlock;
  stxBlocks: BlockListStxBlock[];
  isFirst: boolean;
  stxBlocksLimit?: number;
  minimized?: boolean;
  onlyShowStxBlocksForFirstBtcBlock?: boolean;
}) {
  const unaccountedStxBlocks = btcBlock.blockCount ? stxBlocks.length - btcBlock.blockCount : 0;
  const unaccountedTxs = useMemo(
    () =>
      unaccountedStxBlocks > 0
        ? stxBlocks
            .slice(0, unaccountedStxBlocks)
            .reduce((acc, block) => acc + (block.txsCount || 0), 0)
        : 0,
    [stxBlocks, unaccountedStxBlocks]
  );
  const txsCount = btcBlock.txsCount
    ? isFirst
      ? btcBlock.txsCount + unaccountedTxs
      : btcBlock.txsCount
    : undefined;
  const blocksCount = btcBlock.blockCount
    ? isFirst
      ? btcBlock.blockCount + unaccountedStxBlocks
      : btcBlock.blockCount
    : undefined;
  const numStxBlocksNotDisplayed =
    onlyShowStxBlocksForFirstBtcBlock && !isFirst
      ? blocksCount
        ? blocksCount
        : 0
      : blocksCount
        ? blocksCount - (stxBlocksLimit || 0)
        : 0;
  const displayedStxBlocks = useMemo(
    () => (stxBlocksLimit ? stxBlocks.slice(0, stxBlocksLimit) : stxBlocks),
    [stxBlocks, stxBlocksLimit]
  );
  return (
    <Box border={'1px'} rounded={'lg'} p={PADDING}>
      <BitcoinHeader btcBlock={btcBlock} minimized={minimized} isFirst={isFirst} />
      {onlyShowStxBlocksForFirstBtcBlock && !isFirst ? null : (
        <ScrollableBox>
          <BurnBlockGroupGrid
            stxBlocks={displayedStxBlocks}
            minimized={minimized}
            numStxBlocksNotDisplayed={numStxBlocksNotDisplayed}
          />
        </ScrollableBox>
      )}
      {numStxBlocksNotDisplayed > 0 ? (
        <BlockCount
          count={numStxBlocksNotDisplayed}
          btcBlockHash={btcBlock.hash}
          isFirst={isFirst}
        />
      ) : null}
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
  onlyShowStxBlocksForFirstBtcBlock,
}: {
  blockList: BlockListData[];
  minimized: boolean;
  stxBlocksLimit?: number;
  onlyShowStxBlocksForFirstBtcBlock?: boolean;
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
          onlyShowStxBlocksForFirstBtcBlock={onlyShowStxBlocksForFirstBtcBlock}
        />
      ))}
    </BlockListGroupedLayout>
  );
}
