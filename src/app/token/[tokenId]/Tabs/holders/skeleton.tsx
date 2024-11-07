'use client';

import { Flex, Table } from '@chakra-ui/react';

import { SkeletonText } from '../../../../../components/ui/skeleton';
import { Skeleton } from '../../../../../ui/Skeleton';
import { HoldersTableLayout, holdersTableHeaders } from './Holders';

const TableRowSkeleton = ({ numCols }: { numCols: number }) => {
  const cols = Array.from({ length: numCols }, (_, i) => i + 1);

  return (
    <Table.Row>
      {cols.map((_, index) => (
        <Table.Cell py={3} px={6} textAlign="center" key={`table-row-skeleton-${index}`}>
          <Skeleton width="full" height="14px" />
        </Table.Cell>
      ))}
    </Table.Row>
  );
};

const TableHeaderSkeleton = () => (
  <Table.ColumnHeader py={3} px={6}>
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
  </Table.ColumnHeader>
);

export const HoldersTableSkeleton = () => {
  const numRows = Array.from({ length: 10 }, (_, i) => i + 1);
  const numCols = Array.from({ length: holdersTableHeaders.length }, (_, i) => i + 1);

  return (
    <HoldersTableLayout
      numHolders={<Skeleton width="15%" height={5} />}
      holdersTableHeaders={
        <Table.Row>
          {numCols.map((_, i) => (
            <TableHeaderSkeleton key={`table-header-skeleton-${i}`} />
          ))}
        </Table.Row>
      }
      holdersTableRows={numRows.map((_, i) => (
        <TableRowSkeleton numCols={holdersTableHeaders.length} key={`table-row-skeleton-${i}`} />
      ))}
    />
  );
};
