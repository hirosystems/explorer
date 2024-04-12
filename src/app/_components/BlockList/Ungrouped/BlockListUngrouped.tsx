import { useColorModeValue } from '@chakra-ui/react';
import { ReactNode } from 'react';
import { BsArrowReturnLeft } from 'react-icons/bs';

import { BlockLink, ExplorerLink } from '../../../../common/components/ExplorerLinks';
import { Timestamp } from '../../../../common/components/Timestamp';
import { truncateMiddle } from '../../../../common/utils/utils';
import { Box } from '../../../../ui/Box';
import { Flex, FlexProps } from '../../../../ui/Flex';
import { Grid } from '../../../../ui/Grid';
import { HStack } from '../../../../ui/HStack';
import { Icon } from '../../../../ui/Icon';
import { Stack } from '../../../../ui/Stack';
import { Text } from '../../../../ui/Text';
import { BitcoinIcon, StxIcon } from '../../../../ui/icons';
import { ListHeader } from '../../ListHeader';
import { BlockCount } from '../BlockCount';
import { useBlockListContext } from '../BlockListContext';
import { LineAndNode } from '../LineAndNode';
import { FADE_DURATION, mobileBorderCss } from '../consts';
import { BlockListStxBlock } from '../types';
import { BlockListData } from '../utils';

interface BtcBlockRowProps {
  height: number | string;
  hash: string;
  timestamp?: number;
}
export function BtcBlockRowLayout({ children, ...rest }: FlexProps & { children: ReactNode }) {
  const textColor = useColorModeValue('slate.700', 'slate.500'); // TODO: not in theme. remove
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

export function BtcBlockRowContent({ timestamp, height, hash }: BtcBlockRowProps) {
  const iconColor = useColorModeValue('slate.600', 'slate.800'); // TODO: not in theme. remove
  return (
    <>
      <HStack gap={1.5}>
        <Icon
          as={BsArrowReturnLeft}
          transform={'rotate(90deg)'}
          size={2.5}
          color={iconColor}
          position={'relative'}
          bottom={'1px'}
        />
        <Icon as={BitcoinIcon} size={18} position={'relative'} bottom={'1px'} />
        <ExplorerLink fontSize="sm" color={'textSubdued'} href={`/btcblock/${hash}`}>
          #{height}
        </ExplorerLink>
      </HStack>
      <HStack divider={<>&nbsp;∙&nbsp;</>} fontSize={'xs'}>
        <Box>{truncateMiddle(hash, 3)}</Box>
        {timestamp && <Timestamp ts={timestamp} />}
      </HStack>
    </>
  );
}

export function BtcBlockRow({ timestamp, height, hash }: BtcBlockRowProps) {
  return (
    <BtcBlockRowLayout>
      <BtcBlockRowContent timestamp={timestamp} height={height} hash={hash} />
    </BtcBlockRowLayout>
  );
}

const GroupHeader = () => {
  return (
    <>
      <Box
        position={'sticky'}
        left={0}
        zIndex={'docked'} // TODO: what is this?
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
  icon,
  minimized,
}: {
  height: number | string;
  hash: string;
  timestamp: number;
  txsCount?: number;
  icon?: ReactNode;
  minimized?: boolean;
}) {
  return minimized ? (
    <>
      <Flex alignItems="center" gridColumn="1 / 2" gap={2}>
        <LineAndNode rowHeight={14} width={6} icon={icon} />
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
      <Flex alignItems="center" gap={2}>
        <LineAndNode rowHeight={14} width={6} icon={icon} />
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
      columnGap={4}
      // pt={minimized ? 0 : 6}
      // pb={minimized ? 0 : 3}
    >
      {children}
    </Grid>
  );
}

function StxBlocksGrid({
  stxBlocks,
  minimized,
}: {
  stxBlocks: BlockListStxBlock[];
  minimized: boolean;
}) {
  return (
    <StxBlocksGridLayout>
      {minimized ? null : <GroupHeader />}
      {stxBlocks.map((stxBlock, i) => (
        <>
          <StxBlockRow
            key={`stx-block-grid-row-${i}-${stxBlock.hash}`}
            height={stxBlock.height}
            hash={stxBlock.hash}
            timestamp={stxBlock.timestamp}
            txsCount={stxBlock.txsCount}
            icon={i === 0 ? <Icon as={StxIcon} size={2.5} color={'white'} /> : undefined}
            minimized={minimized}
          />
          {i < stxBlocks.length - 1 && (
            <Box gridColumn={'1/5'} borderBottom={'1px'} borderColor="borderSecondary"></Box>
          )}
        </>
      ))}
    </StxBlocksGridLayout>
  );
}

// Ironic name for a component that is supposedly ungrouped...
function StxBlocksGroupedByBtcBlock({
  blockList,
  stxBlocksLimit,
  minimized = false,
}: {
  blockList: BlockListData;
  stxBlocksLimit?: number;
  minimized?: boolean;
}) {
  const btcBlock = blockList.btcBlock;
  const stxBlocks = blockList.stxBlocks;
  const stxBlocksShortList = stxBlocksLimit
    ? blockList.stxBlocks.slice(0, stxBlocksLimit)
    : blockList.stxBlocks;
  const numStxBlocks = btcBlock.txsCount ?? stxBlocks.length;
  const numStxBlocksNotDisplayed = numStxBlocks - (stxBlocksLimit || stxBlocks.length);

  return (
    <>
      <StxBlocksGrid stxBlocks={stxBlocksShortList} minimized={minimized} />
      {numStxBlocksNotDisplayed > 0 ? <BlockCount count={numStxBlocksNotDisplayed} /> : null}
      <BtcBlockRow
        key={btcBlock.hash}
        hash={btcBlock.hash}
        height={btcBlock.height}
        timestamp={btcBlock.timestamp}
      />
    </>
  );
}

export function BlockListUngroupedLayout({ children }: { children: ReactNode }) {
  const { isBlockListLoading } = useBlockListContext();

  return (
    <Stack
      mt={6}
      gap={5}
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
      {blockList.map(bl => (
        <StxBlocksGroupedByBtcBlock
          key={`stx-blocks-grouped-by-btc-block-${bl.btcBlock.hash}`}
          blockList={bl}
          stxBlocksLimit={stxBlocksLimit}
          minimized={minimized}
        />
      ))}
    </BlockListUngroupedLayout>
  );
}
