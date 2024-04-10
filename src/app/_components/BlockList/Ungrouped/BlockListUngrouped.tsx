import { useColorModeValue } from '@chakra-ui/react';
import { ReactNode } from 'react';

import { Circle } from '../../../../common/components/Circle';
import { BlockLink } from '../../../../common/components/ExplorerLinks';
import { Timestamp } from '../../../../common/components/Timestamp';
import { truncateMiddle } from '../../../../common/utils/utils';
import { Box } from '../../../../ui/Box';
import { Flex } from '../../../../ui/Flex';
import { Grid } from '../../../../ui/Grid';
import { HStack } from '../../../../ui/HStack';
import { Icon } from '../../../../ui/Icon';
import { Stack } from '../../../../ui/Stack';
import { Text } from '../../../../ui/Text';
import { StxIcon } from '../../../../ui/icons';
import { BlockCount } from '../BlockCount';
import { useBlockListContext } from '../BlockListContext';
import { FADE_DURATION } from '../consts';
import { BlockListBtcBlock, BlockListStxBlock } from '../types';
import { BtcBlockListItem } from './BtcBlockListItem';

export interface BlocksByBtcBlock {
  stxBlocks: BlockListStxBlock[];
  btcBlock: BlockListBtcBlock;
}

export type BlockListUngrouped = BlocksByBtcBlock[];

export function BlockListUngroupedLayout({ children }: { children: ReactNode }) {
  const { isBlockListLoading } = useBlockListContext();

  return (
    <Stack
      gap={0}
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

interface StxBlockListItemLayoutProps {
  children: ReactNode;
  hasIcon: boolean;
  hasBorder: boolean;
}

// TODO: move to common
export function LineAndNode({
  rowHeight = 14,
  width = 6,
  icon,
}: {
  rowHeight: number;
  width: number;
  icon?: ReactNode;
}) {
  return (
    <Flex height={rowHeight} width={width} alignItems="center" position="relative">
      {icon ? (
        <Flex
          justifyContent="center"
          alignItems="center"
          height="calc(100% + 1px)"
          width="full"
          position="absolute"
          bg="surface"
        >
          <Circle size={4.5} bg="brand" border="none">
            {icon}
          </Circle>
          <Box
            position="absolute" // the little bit of line needed to connect the icon to the other lines with nodes
            bottom={0}
            height="20%"
            width="1px"
            bg="borderPrimary"
            border="1px solid var(---stacks-colors-borderPrimary)"
          />
        </Flex>
      ) : (
        <Flex
          justifyContent="center"
          height="calc(100% + 1px)"
          width="full"
          position="absolute"
          top={0}
          bottom={0}
          bg="surface"
        >
          <Box
            height="full" // the line
            width="1px"
            bg="borderPrimary"
            border="1px solid var(---stacks-colors-borderPrimary)"
          />
          <Box
            position="absolute" // the node
            width={2}
            height={2}
            borderRadius="50%"
            bg="borderPrimary"
            transform="translateY(-50%)"
            top="50%"
          />
        </Flex>
      )}
    </Flex>
  );
}

// TODO: copied from BlockListGrouped
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

// TODO: copied from BlockListGrouped
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
      <Flex alignItems="center">
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

function StxBlocksGrid({
  stxBlocks,
  minimized,
}: {
  stxBlocks: BlockListStxBlock[];
  minimized: boolean;
}) {
  return (
    <Grid
      templateColumns={minimized ? 'auto 1fr auto' : 'repeat(4, 1fr)'}
      width={'full'}
      columnGap={4}
      pt={minimized ? 0 : 6}
      pb={minimized ? 0 : 3}
    >
      {minimized ? null : <GroupHeader />}
      {stxBlocks.map((stxBlock, i) => (
        <>
          <StxBlockRow
            key={stxBlock.hash}
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
    </Grid>
  );
}

// Ironic name for a component that is supposedly ungrouped...
function StxBlocksGroupedByBtcBlock({
  blockList,
  stxBlocksLimit,
  minimized = false,
}: {
  blockList: BlocksByBtcBlock;
  stxBlocksLimit?: number;
  minimized?: boolean;
}) {
  const btcBlock = blockList.btcBlock;
  const stxBlocks = blockList.stxBlocks;
  const stxBlocksShortList = stxBlocksLimit
    ? blockList.stxBlocks.slice(0, stxBlocksLimit)
    : blockList.stxBlocks;

  return (
    <>
      <StxBlocksGrid key={btcBlock.hash} stxBlocks={stxBlocksShortList} minimized={minimized} />
      {stxBlocksLimit && stxBlocks.length > stxBlocksLimit && (
        <BlockCount count={stxBlocks.length - stxBlocksLimit} />
      )}
      <BtcBlockListItem
        key={btcBlock.hash}
        hash={btcBlock.hash}
        height={btcBlock.height}
        timestamp={btcBlock.timestamp}
      />
    </>
  );
}

export function BlockListUngrouped({
  blockList,
  stxBlocksLimit,
  minimized = false,
}: {
  blockList: BlockListUngrouped;
  stxBlocksLimit?: number;
  minimized?: boolean;
}) {
  return (
    <BlockListUngroupedLayout>
      {blockList.map(blocksGroupedByBtcBlock => (
        <StxBlocksGroupedByBtcBlock
          key={blocksGroupedByBtcBlock.btcBlock.hash}
          blockList={blocksGroupedByBtcBlock}
          stxBlocksLimit={stxBlocksLimit}
          minimized={minimized}
        />
      ))}
    </BlockListUngroupedLayout>
  );
}

// TODO: redo this component
export function StxBlockListItemLayout({
  children,
  hasIcon,
  hasBorder,
}: StxBlockListItemLayoutProps) {
  return (
    <Box
      ml={2.5}
      pl={3.5}
      borderLeft={hasIcon ? undefined : '1px'} // the line through the node
      borderColor="borderPrimary"
      position="relative"
      height={14}
    >
      <Flex
        height="full"
        justifyContent="space-between"
        alignItems="center"
        flexGrow={1}
        borderBottom={hasBorder ? '1px solid var(--stacks-colors-borderSecondary)' : 'none'}
        _after={
          hasIcon
            ? {
                // adds a little line to the left of the first block with an icon
                content: '""',
                position: 'absolute',
                left: '0px',
                bottom: '0',
                height: '10px',
                width: '1px',
                backgroundColor: 'borderPrimary',
              }
            : {
                // node
                content: '""',
                position: 'absolute',
                left: '-3px',
                top: '50%',
                transform: 'translateY(-50%)',
                width: '6px',
                height: '6px',
                backgroundColor: 'borderPrimary',
                borderRadius: '50%',
              }
        }
      >
        {children}
      </Flex>
    </Box>
  );
}
