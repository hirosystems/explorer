import { ReactNode } from 'react';

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
import { ListHeader } from '../../ListHeader';
import { BlockCount } from '../BlockCount';
import { useBlockListContext } from '../BlockListContext';
import { LineAndNode } from '../LineAndNode';
import { FADE_DURATION } from '../consts';
import { BlockListStxBlock } from '../types';
import { BlockListData } from '../utils';
import { BtcBlockRow } from './BtcBlockRow';

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
      pt={minimized ? 0 : 6}
      pb={minimized ? 0 : 3}
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
  console.log({ numStxBlocks, numStxBlocksNotDisplayed, stxBlocksLimit, btcBlock, stxBlocks });

  return (
    <>
      <StxBlocksGrid key={btcBlock.hash} stxBlocks={stxBlocksShortList} minimized={minimized} />
      {stxBlocksLimit && stxBlocks.length > stxBlocksLimit && (
        <BlockCount count={stxBlocks.length - stxBlocksLimit} />
      )}
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
          key={bl.btcBlock.hash}
          blockList={bl}
          stxBlocksLimit={stxBlocksLimit}
          minimized={minimized}
        />
      ))}
    </BlockListUngroupedLayout>
  );
}
