import { Timestamp } from '@/common/components/Timestamp';
import { useColorModeValue } from '@chakra-ui/react';
import styled from '@emotion/styled';
import { ReactNode, Suspense, useMemo } from 'react';

import { Block } from '@stacks/blockchain-api-client';

import { BlockLink } from '../../../common/components/ExplorerLinks';
import { ListFooter } from '../../../common/components/ListFooter';
import { Section } from '../../../common/components/Section';
import { useSuspenseInfiniteQueryResult } from '../../../common/hooks/useInfiniteQueryResult';
import { useSuspenseBlockListInfinite } from '../../../common/queries/useBlockListInfinite';
import { truncateMiddle } from '../../../common/utils/utils';
import { Box } from '../../../ui/Box';
import { Flex } from '../../../ui/Flex';
import { Table } from '../../../ui/Table';
import { Tbody } from '../../../ui/Tbody';
import { Td } from '../../../ui/Td';
import { Text } from '../../../ui/Text';
import { Th } from '../../../ui/Th';
import { Thead } from '../../../ui/Thead';
import { Tr } from '../../../ui/Tr';
import { ScrollableBox } from '../../_components/BlockList/ScrollableDiv';
import { ExplorerErrorBoundary } from '../../_components/ErrorBoundary';
import { BlocksTableSkeleton } from './skeleton';

const StyledTable = styled(Table)`
  th {
    border-bottom: none;
  }

  tr:last-child td {
    border-bottom: none;
  }
`;

export const BlocksTableHeader = ({
  headerTitle,
  isFirst,
}: {
  headerTitle: string;
  isFirst: boolean;
}) => (
  <Th py={3} px={6} border="none" width="fit-content">
    <Flex
      bg="hoverBackground"
      px={2.5}
      py={2}
      borderRadius="md"
      justifyContent="center"
      alignItems="center"
      width="fit-content"
    >
      <Text
        fontWeight="medium"
        whiteSpace="nowrap"
        fontSize="xs"
        color={useColorModeValue('slate.700', 'slate.250')}
        textTransform="none"
        letterSpacing="normal"
      >
        {headerTitle}
      </Text>
    </Flex>
  </Th>
);

export const blocksTableHeaders = [
  'Block Height',
  'Block Hash',
  'Transactions',
  'Timestamp',
  'BTC Block Height',
  'BTC Block Hash',
  'BTC Timestamp',
];

export const BlocksTableHeaders = () => (
  <Tr>
    {blocksTableHeaders.map((header, i) => (
      <BlocksTableHeader
        key={`signers-table-header-${header}`}
        headerTitle={header}
        isFirst={i === 0}
      />
    ))}
  </Tr>
);

function getMillisecondsFromISOString(isoString: string) {
  return new Date(isoString).getTime();
}

const BlocksTableRow = ({
  index,
  isFirst,
  isLast,
  blockHeight,
  blockHash,
  transactions,
  timestamp,
  btcBlockHeight,
  btcBlockHash,
  btcTimestamp,
}: {
  index: number;
  isFirst: boolean;
  isLast: boolean;
} & BlocksTableRowInfo) => {
  return (
    <Tr
      style={{
        borderTop: isFirst ? 'none' : '',
        borderBottom: isLast ? 'none' : '',
      }}
    >
      <Td py={3} px={6}>
        <Text whiteSpace="nowrap" fontSize="sm" pl={2}>
          <BlockLink hash={blockHash}>{blockHeight}</BlockLink>
        </Text>
      </Td>
      <Td py={3} px={6}>
        <Text fontSize="sm" whiteSpace="nowrap" overflow="hidden" textOverflow="ellipsis">
          <BlockLink hash={blockHash}>{truncateMiddle(blockHash)}</BlockLink>
        </Text>
      </Td>
      <Td py={3} px={6}>
        <Text whiteSpace="nowrap" fontSize="sm" pl={2}>
          {transactions}
        </Text>
      </Td>
      <Td py={3} px={6}>
        <Text whiteSpace="nowrap" fontSize="sm" pl={2}>
          <Timestamp timestampInMs={getMillisecondsFromISOString(timestamp)} />
        </Text>
      </Td>
      <Td py={3} px={6}>
        <Text whiteSpace="nowrap" fontSize="sm" pl={2}>
          <BlockLink hash={btcBlockHash}>{btcBlockHeight}</BlockLink>
        </Text>
      </Td>
      <Td py={3} px={6}>
        <Text fontSize="sm" whiteSpace="nowrap" overflow="hidden" textOverflow="ellipsis">
          <BlockLink hash={btcBlockHash}>{truncateMiddle(btcBlockHash)}</BlockLink>
        </Text>
      </Td>
      <Td py={3} px={6}>
        <Text whiteSpace="nowrap" fontSize="sm" pl={2}>
          <Timestamp timestampInMs={getMillisecondsFromISOString(btcTimestamp)} />
        </Text>
      </Td>
    </Tr>
  );
};

export function BlocksTableLayout({
  blocksTableHeaders,
  blocksTableRows,
  footer,
}: {
  blocksTableHeaders: ReactNode;
  blocksTableRows: ReactNode;
  footer: ReactNode;
}) {
  return (
    <Section title={'Blocks'}>
      <ScrollableBox>
        <StyledTable width="full">
          <Thead>{blocksTableHeaders}</Thead>
          <Tbody>{blocksTableRows}</Tbody>
        </StyledTable>
      </ScrollableBox>
      <Box pt={5} pb={5}>
        {footer}
      </Box>
    </Section>
  );
}

interface BlocksTableRowInfo {
  blockHeight: number;
  blockHash: string;
  transactions: number;
  timestamp: string;
  btcBlockHeight: number;
  btcBlockHash: string;
  btcTimestamp: string;
}

function getBlocksTableRowData(block: Block): BlocksTableRowInfo {
  return {
    blockHeight: block.height,
    blockHash: block.hash,
    transactions: block.txs.length,
    timestamp: block.block_time_iso,
    btcBlockHeight: block.burn_block_height,
    btcBlockHash: block.burn_block_hash,
    btcTimestamp: block.burn_block_time_iso,
  };
}

const BlocksTableBase = () => {
  const blocksListResponse = useSuspenseBlockListInfinite();
  const { isFetchingNextPage, fetchNextPage, hasNextPage } = blocksListResponse;
  const blocks = useSuspenseInfiniteQueryResult<Block>(blocksListResponse);
  const uniqueBlocks = useMemo(() => {
    const uniqueBlockMap = new Map();
    blocks.forEach(block => {
      if (!uniqueBlockMap.has(block.height)) {
        uniqueBlockMap.set(block.height, block);
      }
    });
    return Array.from(uniqueBlockMap.values());
  }, [blocks]);

  return (
    <BlocksTableLayout
      blocksTableHeaders={<BlocksTableHeaders />}
      blocksTableRows={uniqueBlocks.map((block, i) => (
        <BlocksTableRow
          key={`blocks-table-row-${block.hash}`}
          index={i}
          {...getBlocksTableRowData(blocks[i])}
          isFirst={i === 0}
          isLast={i === blocks.length - 1}
        />
      ))}
      footer={
        <ListFooter
          isLoading={isFetchingNextPage}
          hasNextPage={hasNextPage}
          fetchNextPage={fetchNextPage}
          label={'blocks'}
        />
      }
    />
  );
};

export const BlocksTable = () => {
  return (
    <ExplorerErrorBoundary
      Wrapper={Section}
      wrapperProps={{
        title: 'Blocks',
        gridColumnStart: ['1', '1', '2'],
        gridColumnEnd: ['2', '2', '3'],
        minWidth: 0,
      }}
      tryAgainButton
    >
      <Suspense fallback={<BlocksTableSkeleton />}>
        <BlocksTableBase />
      </Suspense>
    </ExplorerErrorBoundary>
  );
};
