'use client';

import { Flex } from '../../../ui/Flex';
import { SkeletonItem } from '../../../ui/SkeletonItem';
import { SkeletonText } from '../../../ui/SkeletonText';
import { Td } from '../../../ui/Td';
import { Th } from '../../../ui/Th';
import { Tr } from '../../../ui/Tr';
import { BlocksTableLayout, blocksTableHeaders } from './BlocksTable';

const TableRowSkeleton = ({ numCols }: { numCols: number }) => {
  const cols = Array.from({ length: numCols }, (_, i) => i + 1);

  return (
    <Tr>
      {cols.map((_, index) => (
        <Td py={3} px={6} textAlign="center" key={`table-row-skeleton-${index}`}>
          <SkeletonItem width="full" height="14px" />
        </Td>
      ))}
    </Tr>
  );
};

const TableHeaderSkeleton = () => (
  <Th py={3} px={6}>
    <Flex
      bg="hoverBackground"
      px={2.5}
      py={2}
      borderRadius="md"
      justifyContent="center"
      alignItems="center"
    >
      <SkeletonText noOfLines={1} height="14px" />
    </Flex>
  </Th>
);

export const BlocksTableSkeleton = () => {
  const numRows = Array.from({ length: 20 }, (_, i) => i + 1);
  const numCols = Array.from({ length: blocksTableHeaders.length }, (_, i) => i + 1);

  return (
    <BlocksTableLayout
      blocksTableHeaders={
        <Tr>
          {numCols.map((_, i) => (
            <TableHeaderSkeleton key={`table-header-skeleton-${i}`} />
          ))}
        </Tr>
      }
      blocksTableRows={numRows.map((_, i) => (
        <TableRowSkeleton numCols={blocksTableHeaders.length} key={`table-row-skeleton-${i}`} />
      ))}
      footer={<SkeletonItem width="full" height="40px" />}
    />
  );
};
