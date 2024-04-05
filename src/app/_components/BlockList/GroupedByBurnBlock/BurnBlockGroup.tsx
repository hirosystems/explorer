import { useColorModeValue } from '@chakra-ui/react';
import { ReactNode, useEffect, useRef, useState } from 'react';
import { PiArrowElbowLeftDown } from 'react-icons/pi';

import { Circle } from '../../../../common/components/Circle';
import { BlockLink, ExplorerLink } from '../../../../common/components/ExplorerLinks';
import { Timestamp } from '../../../../common/components/Timestamp';
import { truncateMiddle } from '../../../../common/utils/utils';
import { Box } from '../../../../ui/Box';
import { Flex } from '../../../../ui/Flex';
import { Grid } from '../../../../ui/Grid';
import { HStack } from '../../../../ui/HStack';
import { Icon } from '../../../../ui/Icon';
import { Text, TextProps } from '../../../../ui/Text';
import { BitcoinIcon, StxIcon } from '../../../../ui/icons';
import { Caption } from '../../../../ui/typography';
import { BlockCount } from '../LayoutA/BlockCount';
import { UISingleBlock } from '../types';

export function ListHeader({ children, ...textProps }: { children: ReactNode } & TextProps) {
  const color = useColorModeValue('slate.700', 'slate.250');
  return (
    <Text
      py={2}
      px={2.5}
      color={color}
      bg={'hoverBackground'}
      fontSize={'xs'}
      rounded={'md'}
      whiteSpace={'nowrap'}
      {...textProps}
    >
      {children}
    </Text>
  );
}

const GroupHeaderSkeleton = () => {};

const GroupHeader = () => {
  return (
    <>
      <Box
        position={'sticky'}
        left={0}
        zIndex={'docked'} // TODO: what is this?
        bg={'surface'}
        pr={4}
        sx={{
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
        }}
      >
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

// TODO: ideally this would be a table
const StxBlockRow = ({ block, icon }: { block: UISingleBlock; icon?: ReactNode }) => {
  return (
    <>
      <Flex
        flex={1}
        position={'sticky'}
        left={0}
        zIndex={'docked'} // TODO: what is this?
        bg={'surface'}
        gap={2}
        pl={7}
        fontSize={'xs'}
        sx={{
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
        }}
      >
        {icon}
        <BlockLink hash={block.hash}>
          <Text color="text" fontWeight={'medium'} fontSize={'xs'}>
            #{block.height}
          </Text>
        </BlockLink>
      </Flex>
      <BlockLink hash={block.hash} flex={1}>
        <Text color="text" fontWeight={'medium'} fontSize={'xs'}>
          {block.hash}
        </Text>
      </BlockLink>
      <Text color="text" fontWeight={'medium'} flex={1} fontSize={'xs'}>
        100
      </Text>
      <Flex flex={1}>
        <Timestamp ts={block.timestamp} />
      </Flex>
    </>
  );
};

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
      // py={4}
      className={hasHorizontalScroll ? 'has-horizontal-scroll' : ''}
    >
      {children}
    </Box>
  );
}

export interface BlocksGroupProps {
  burnBlock: UISingleBlock;
  stxBlocks: UISingleBlock[];
  /**
   * TODO: change to
   * burnBlock: BurnBlock;
   * stxBlocks: Block[];
   */
  stxBlocksDisplayLimit?: number;
}

export function BurnBlockGroupGrid({
  burnBlock,
  stxBlocks,
  stxBlocksDisplayLimit,
}: BlocksGroupProps) {
  const stxBlocksToDisplay = stxBlocksDisplayLimit
    ? stxBlocks.slice(0, stxBlocksDisplayLimit)
    : stxBlocks;
  return (
    <Grid
      templateColumns="repeat(4, 1fr)"
      gap={4}
      width={'full'}
      rowGap={4}
      key={burnBlock.hash}
      pb={7}
    >
      <GroupHeader />
      {stxBlocksToDisplay.map((stxBlock, i) => (
        <>
          <StxBlockRow
            key={stxBlock.hash}
            block={stxBlock}
            icon={
              i === 0 ? (
                <Circle size={4.5} bg="brand" border={'none'} position={'absolute'} left={0}>
                  <Icon as={StxIcon} size={2.5} color={'white'} />
                </Circle>
              ) : (
                <Box // Adds a vertical line to the left of the first column with a circle
                  bg={'surface'}
                  width={4.5}
                  height={16}
                  top={'calc(var(--stacks-sizes-6) * -1)'}
                  left={0}
                  position={'absolute'}
                  _after={{
                    content: '""',
                    position: 'absolute',
                    left: '50%',
                    top: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 'var(--stacks-sizes-2)',
                    height: 'var(--stacks-sizes-2)',
                    backgroundColor: 'var(--stacks-colors-borderPrimary)',
                    borderRadius: '50%',
                  }}
                  _before={{
                    content: '""',
                    position: 'absolute',
                    left: '0',
                    right: '0',
                    margin: 'auto',
                    top: 0,
                    width: '1px',
                    height: 'var(--stacks-sizes-14)',
                    backgroundColor: 'var(--stacks-colors-borderPrimary)',
                  }}
                ></Box>
              )
            }
          />
          {i < stxBlocks.length - 1 && (
            <Box gridColumn={'1/5'} borderBottom={'1px'} borderColor="borderSecondary"></Box>
          )}{' '}
          {/* TODO: adds a border to the bottom. make this css */}
        </>
      ))}
    </Grid>
  );
}

function BitcoinHeader({ burnBlock }: { burnBlock: UISingleBlock }) {
  return (
    <Flex alignItems={'center'} gap={1.5} pb={4}>
      <Icon as={PiArrowElbowLeftDown} size={3.5} color={'textSubdued'} />
      <Icon as={BitcoinIcon} size={4.5} />
      <Text fontSize={'sm'} color={'textSubdued'} fontWeight={'medium'}>
        {burnBlock.height}
      </Text>
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
      <HStack divider={<Caption>∙</Caption>} gap={1} pt={4}>
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
  stxBlocksDisplayLimit = stxBlocks.length,
}: BlocksGroupProps) {
  const stxBlocksNotDisplayed = burnBlock.txsCount
    ? burnBlock.txsCount - (stxBlocksDisplayLimit || 0)
    : 0;
  const txSum = stxBlocks.reduce((txSum, stxBlock) => {
    const txsCount = stxBlock?.txsCount ?? 0;
    return txSum + txsCount;
  }, 0);
  // const totalTime = stxBlocks.reduce((totalTime, stxBlock) => {
  //   const blockTime = stxBlock.timestamp ?? 0;
  //   return totalTime + blockTime;
  // }, 0);
  // const averageBlockTime = stxBlocks.length ? Math.floor(totalTime / stxBlocks.length) : 0;
  console.log({ burnBlock, stxBlocks, stxBlocksDisplayLimit, stxBlocksNotDisplayed }); // TODO: remove
  // TODO: why are we not using table here?
  return (
    <Box border={'1px'} rounded={'lg'} p={4} key={burnBlock.hash}>
      <BitcoinHeader burnBlock={burnBlock} />
      <ScrollableDiv>
        <BurnBlockGroupGrid
          burnBlock={burnBlock}
          stxBlocks={stxBlocks}
          stxBlocksDisplayLimit={stxBlocksDisplayLimit}
        />
      </ScrollableDiv>
      {stxBlocksNotDisplayed > 0 ? <BlockCount count={stxBlocksNotDisplayed} /> : null}
      <Footer stxBlocks={stxBlocks} txSum={txSum} />
    </Box>
  );
}
