import { ReactNode, useEffect, useRef, useState } from 'react';
import { PiArrowElbowLeftDown } from 'react-icons/pi';

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
import { BitcoinIcon, StxIcon } from '../../../../ui/icons';
import { Caption } from '../../../../ui/typography';
import { ListHeader } from '../../ListHeader';
import { BlockCount } from '../BlockCount';
import { useBlockListContext } from '../BlockListContext';
import { LineAndNode } from '../LineAndNode';
import { FADE_DURATION } from '../consts';
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

// TODO: move to common components
// adds horizontal scrolling to its children if they overflow the container's width, and adds a class to the container when it has a horizontal scrollbar
function ScrollableDiv({ children }: { children: ReactNode }) {
  const [hasHorizontalScroll, setHasHorizontalScroll] = useState(false);
  const divRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const checkForScroll = () => {
      if (divRef.current) {
        const { scrollWidth, clientWidth } = divRef.current;
        if (scrollWidth > clientWidth) {
          setHasHorizontalScroll(true);
        } else {
          setHasHorizontalScroll(false);
        }
      }
    };
    checkForScroll();
    window.addEventListener('resize', checkForScroll);
    return () => window.removeEventListener('resize', checkForScroll);
  }, []);

  return (
    <Box
      ref={divRef}
      overflowX={'auto'}
      overflowY={'hidden'}
      className={hasHorizontalScroll ? 'has-horizontal-scroll' : ''}
    >
      {children}
    </Box>
  );
}

const mobileBorderCss = {
  '.has-horizontal-scroll &:before': {
    // Adds a border to the left of the first column
    content: '""',
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: '2px',
    height: 'var(--stacks-sizes-14)',
    backgroundColor: 'borderPrimary',
  },
};

const StxBlockRow = ({
  stxBlock,
  icon,
  minimized = false,
}: {
  stxBlock: BlockListStxBlock;
  icon?: ReactNode;
  minimized?: boolean;
}) => {
  return minimized ? (
    <>
      <Flex
        position="sticky"
        left={0}
        gap={2}
        fontSize="xs"
        sx={mobileBorderCss}
        key={stxBlock.hash}
        gridColumn="1 / 2"
        alignItems="center"
      >
        <LineAndNode rowHeight={14} width={6} icon={icon} />
        <BlockLink hash={stxBlock.hash}>
          <Text color="text" fontWeight="medium" fontSize="xs">
            #{stxBlock.height}
          </Text>
        </BlockLink>
      </Flex>

      <HStack divider={<Caption>∙</Caption>} gap={1} whiteSpace="nowrap" gridColumn="3 / 4">
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
        zIndex="docked" // TODO: what is this?
        bg="surface"
        gap={2}
        fontSize="xs"
        sx={mobileBorderCss}
        key={stxBlock.hash}
        alignItems="center"
      >
        <LineAndNode rowHeight={14} width={6} icon={icon} />
        <BlockLink hash={stxBlock.hash}>
          <Text color="text" fontWeight="medium" fontSize="xs">
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
      columnGap={4}
      // pt={4}
      // pb={7}
    >
      {children}
    </Grid>
  );
}

export function BurnBlockGroupGrid({
  stxBlocks,
  minimized,
}: {
  stxBlocks: BlockListStxBlock[]; // TODO: remove
  minimized: boolean;
}) {
  return (
    <BurnBlockGroupGridLayout minimized={minimized}>
      {minimized ? null : <GroupHeader />}
      {stxBlocks.map((stxBlock, i) => (
        <>
          <StxBlockRow
            key={`stx-block-row-${stxBlock.hash}`}
            stxBlock={stxBlock}
            icon={i === 0 ? <Icon as={StxIcon} size={2.5} color={'white'} /> : undefined}
            minimized={minimized}
          />
          {i < stxBlocks.length - 1 && (
            <Box gridColumn={'1/5'} borderBottom={'1px'} borderColor="borderSecondary"></Box>
          )}
        </>
      ))}
    </BurnBlockGroupGridLayout>
  );
}

function BitcoinHeader({
  btcBlock,
  minimized = false,
}: {
  btcBlock: BlockListBtcBlock;
  minimized?: boolean;
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
    >
      <Flex alignItems={'center'} gap={1.5}>
        <Icon as={PiArrowElbowLeftDown} size={3.5} color={'textSubdued'} />
        <Icon as={BitcoinIcon} size={4.5} />
        <Text fontSize={'sm'} color={'textSubdued'} fontWeight={'medium'}>
          {btcBlock.height}
        </Text>
      </Flex>
      <HStack divider={<Caption>∙</Caption>} gap={1}>
        <ExplorerLink fontSize="xs" color={'textSubdued'} href={`/btcblock/${btcBlock.hash}`}>
          {truncateMiddle(btcBlock.hash, 6)}
        </ExplorerLink>
        <Timestamp ts={btcBlock.timestamp} />
      </HStack>
    </Flex>
  );
}

export function Footer({ stxBlocks, txSum }: { stxBlocks: BlockListStxBlock[]; txSum: number }) {
  return (
    <Box borderTop="1px solid var(--stacks-colors-borderSecondary)">
      <HStack divider={<Caption>∙</Caption>} gap={1} pt={4} whiteSpace="nowrap">
        <Text color="textSubdued" fontSize="xs">
          {stxBlocks.length} blocks
        </Text>
        <Text color="textSubdued" fontSize="xs">
          {txSum} transactions
        </Text>
        <Text color="textSubdued" fontSize="xs">
          Average block time: 29 sec.
        </Text>
      </HStack>
    </Box>
  );
}

export interface BlocksGroupProps {
  btcBlock: BlockListBtcBlock;
  stxBlocks: BlockListStxBlock[];
  stxBlocksLimit?: number;
  minimized?: boolean;
}

export function BurnBlockGroup({
  btcBlock,
  stxBlocks,
  stxBlocksLimit,
  minimized = false,
}: BlocksGroupProps) {
  const numStxBlocks = btcBlock.txsCount ?? stxBlocks.length;
  const numStxBlocksNotDisplayed = numStxBlocks - (stxBlocksLimit || 0);
  const txSum = stxBlocks.reduce((txSum, stxBlock) => {
    const txsCount = stxBlock?.txsCount ?? 0;
    return txSum + txsCount;
  }, 0);
  const stxBlocksShortList = stxBlocksLimit ? stxBlocks.slice(0, stxBlocksLimit) : stxBlocks;
  // const totalTime = stxBlocks.reduce((totalTime, stxBlock) => {
  //   const blockTime = stxBlock.timestamp ?? 0;
  //   return totalTime + blockTime;
  // }, 0);
  // const averageBlockTime = stxBlocks.length ? Math.floor(totalTime / stxBlocks.length) : 0;
  return (
    <Box border={'1px'} rounded={'lg'} p={PADDING} key={btcBlock.hash}>
      <BitcoinHeader btcBlock={btcBlock} minimized={minimized} />
      <ScrollableDiv>
        <BurnBlockGroupGrid stxBlocks={stxBlocksShortList} minimized={minimized} />
      </ScrollableDiv>
      {numStxBlocksNotDisplayed > 0 ? <BlockCount count={numStxBlocksNotDisplayed} /> : null}
      <Footer stxBlocks={stxBlocks} txSum={txSum} />
    </Box>
  );
}

export function BlockListGroupedLayout({ children }: { children: ReactNode }) {
  const { isBlockListLoading } = useBlockListContext();

  return (
    <Stack
      gap={4}
      width={'full'}
      style={{
        transition: `opacity ${FADE_DURATION / 1000}s`,
        opacity: isBlockListLoading ? 0 : 1,
      }}
    >
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
      {blockList.map(block => (
        <BurnBlockGroup
          key={`burn-block-group-${block.btcBlock.hash}`}
          btcBlock={block.btcBlock}
          stxBlocks={block.stxBlocks}
          minimized={minimized}
          stxBlocksLimit={stxBlocksLimit}
        />
      ))}
    </BlockListGroupedLayout>
  );
}
