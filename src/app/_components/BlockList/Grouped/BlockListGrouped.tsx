import { useColorModeValue } from '@chakra-ui/react';
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
import { Text, TextProps } from '../../../../ui/Text';
import { BitcoinIcon, StxIcon } from '../../../../ui/icons';
import { Caption } from '../../../../ui/typography';
import { BlockCount } from '../BlockCount';
import { useBlockListContext } from '../BlockListContext';
import { LineAndNode } from '../Ungrouped/BlockListUngrouped';
import { FADE_DURATION } from '../consts';
import { UISingleBlock } from '../types';

const PADDING = 4;

// TODO: move to common components
export function ListHeader({ children, ...textProps }: { children: ReactNode } & TextProps) {
  const color = useColorModeValue('slate.700', 'slate.250');
  return (
    <Text
      py={2}
      px={2.5}
      color={color}
      bg="hoverBackground"
      fontSize="xs"
      rounded="md"
      whiteSpace="nowrap"
      {...textProps}
    >
      {children}
    </Text>
  );
}

// TODO: move to common components
const GroupHeader = () => {
  return (
    <>
      <Box position="sticky" left={0} bg="surface" pr={4} sx={mobileBorderCss}>
        <ListHeader width={'fit-content'}>Block height</ListHeader>
      </Box>
      <Box>
        <ListHeader width={'fit-content'}>Block hash</ListHeader>
      </Box>
      <Box>
        <ListHeader width={'fit-content'}>Transactions</ListHeader>
      </Box>
      <Box>
        <ListHeader width={'fit-content'}>Timestamp</ListHeader>
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

export interface BlocksGroupProps {
  burnBlock: UISingleBlock; // TODO: don't use this. Have to change data fetching. Use new websocket hook
  stxBlocks: UISingleBlock[];
  /**
   * TODO: change to
   * burnBlock: BurnBlock;
   * stxBlocks: Block[];
   */
  stxBlocksLimit?: number;
  minimized?: boolean;
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
  block,
  icon,
  minimized = false,
}: {
  block: UISingleBlock;
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
        key={block.hash}
        gridColumn="1 / 2"
        alignItems="center"
      >
        <LineAndNode rowHeight={14} width={6} icon={icon} />
        <BlockLink hash={block.hash}>
          <Text color="text" fontWeight="medium" fontSize="xs">
            #{block.height}
          </Text>
        </BlockLink>
      </Flex>

      <HStack divider={<Caption>∙</Caption>} gap={1} whiteSpace="nowrap" gridColumn="3 / 4">
        <BlockLink hash={block.hash}>
          <Text color="textSubdued" fontWeight="medium" fontSize="xs" whiteSpace="nowrap">
            {truncateMiddle(block.hash, 3)}
          </Text>
        </BlockLink>
        {block.txsCount !== undefined ? (
          <Text color="textSubdued" fontWeight="medium" fontSize="xs">
            {block.txsCount || 0} txn
          </Text>
        ) : null}
        <Timestamp ts={block.timestamp} />
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
        key={block.hash}
        alignItems="center"
      >
        <LineAndNode rowHeight={14} width={6} icon={icon} />
        <BlockLink hash={block.hash}>
          <Text color="text" fontWeight="medium" fontSize="xs">
            #{block.height}
          </Text>
        </BlockLink>
      </Flex>

      <Flex alignItems="center">
        <BlockLink hash={block.hash}>
          <Text color="text" fontWeight="medium" fontSize="xs">
            {block.hash}
          </Text>
        </BlockLink>
      </Flex>

      <Flex alignItems="center">
        <Text color="text" fontWeight="medium" fontSize="xs">
          {block.txsCount}
        </Text>
      </Flex>

      <Flex alignItems="center">
        <Timestamp ts={block.timestamp} />
      </Flex>
    </>
  );
};

export function BurnBlockGroupGrid({ burnBlock, stxBlocks, minimized }: BlocksGroupProps) {
  return (
    <Grid
      templateColumns={minimized ? 'auto 1fr auto' : 'repeat(4, 1fr)'}
      width={'full'}
      columnGap={4}
      key={burnBlock.hash}
      pt={4}
      pb={7}
    >
      {minimized ? null : <GroupHeader />}
      {stxBlocks.map((stxBlock, i) => (
        <>
          <StxBlockRow
            key={stxBlock.hash}
            block={stxBlock}
            icon={i === 0 ? <Icon as={StxIcon} size={2.5} color={'white'} /> : undefined}
            minimized={minimized}
          />
          {i < stxBlocks.length - 1 && (
            <Box gridColumn={'1/5'} borderBottom={'1px'} borderColor="borderSecondary"></Box>
          )}
        </>
      ))}
    </Grid>
  );
}

function BitcoinHeader({
  burnBlock,
  minimized = false,
}: {
  burnBlock: UISingleBlock;
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
          {burnBlock.height}
        </Text>
      </Flex>
      <HStack divider={<Caption>∙</Caption>} gap={1}>
        <ExplorerLink fontSize="xs" color={'textSubdued'} href={`/btcblock/${burnBlock.hash}`}>
          {truncateMiddle(burnBlock.hash, 6)}
        </ExplorerLink>
        <Timestamp ts={burnBlock.timestamp} />
      </HStack>
    </Flex>
  );
}

export function Footer({ stxBlocks, txSum }: { stxBlocks: UISingleBlock[]; txSum: number }) {
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

export function BurnBlockGroup({
  burnBlock,
  stxBlocks,
  stxBlocksLimit,
  minimized = false,
}: BlocksGroupProps) {
  const stxBlocksNotDisplayed = burnBlock.txsCount ? burnBlock.txsCount - (stxBlocksLimit || 0) : 0;
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
  // TODO: why are we not using table here?
  return (
    <Box border={'1px'} rounded={'lg'} p={PADDING} key={burnBlock.hash}>
      <BitcoinHeader burnBlock={burnBlock} minimized={minimized} />
      <ScrollableDiv>
        <BurnBlockGroupGrid
          burnBlock={burnBlock}
          stxBlocks={stxBlocksShortList}
          minimized={minimized}
        />
      </ScrollableDiv>
      {stxBlocksNotDisplayed > 0 ? <BlockCount count={stxBlocksNotDisplayed} /> : null}
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
}: {
  blockList: BlocksGroupProps[];
  minimized: boolean;
}) {
  return (
    <BlockListGroupedLayout>
      {blockList.map(block => (
        <BurnBlockGroup
          minimized={minimized}
          burnBlock={block.burnBlock}
          stxBlocks={block.stxBlocks}
          stxBlocksLimit={block.stxBlocksLimit}
        />
      ))}
    </BlockListGroupedLayout>
  );
}
