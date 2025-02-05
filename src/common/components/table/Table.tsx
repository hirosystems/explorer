import { ScrollableBox } from '@/app/_components/BlockList/ScrollableDiv';
import { Tooltip } from '@/ui/Tooltip';
import { Table as ChakraTable, Flex, Icon } from '@chakra-ui/react';
import styled from '@emotion/styled';
import { ArrowDown, ArrowUp, ArrowsDownUp, Info } from '@phosphor-icons/react';
import React, { Suspense, useCallback, useState } from 'react';

import { Text } from '@/ui/Text';
import { ExplorerErrorBoundary } from '../../../app/_components/ErrorBoundary';
import { mobileBorderCss } from '../../constants/constants';
import { TableContainer } from './TableContainer';
import { TableSkeleton } from './TableSkeleton';

const StyledTable = styled(ChakraTable.Root)`
  tr td {
    border-bottom: none;
  }
`;

type SortOrder = 'asc' | 'desc';

interface SortIconProps {
  sortable: boolean | undefined;
  sortColumn: string | undefined | null;
  columnId: string;
  sortOrder: SortOrder | undefined;
  onSort: ((columnId: string, direction: SortOrder) => void) | undefined;
}

function SortIcon({ sortable, sortColumn, columnId, sortOrder, onSort }: SortIconProps) {
  if (!sortable) return null;
  return (
    <Icon
      onClick={() => {
        onSort?.(columnId, sortOrder === 'asc' ? 'desc' : 'asc');
      }}
      as={sortColumn !== columnId ? ArrowsDownUp : sortOrder === 'asc' ? ArrowUp : ArrowDown}
      h={4}
      w={4}
    >
      {sortColumn !== columnId ? <ArrowsDownUp/> : sortOrder === 'asc' ? <ArrowUp/> : <ArrowDown/>}
    </Icon>
  );
}

export const TableHeader = <T extends unknown[]>({
  columnDefinition,
  sortColumn,
  sortOrder,
  headerTitle,
  isFirst,
  onSort,
}: {
  sortColumn?: string | null;
  sortOrder?: SortOrder;
  columnDefinition: ColumnDefinition<T>;
  headerTitle: string | React.ReactNode;
  isFirst: boolean;
  onSort?: (columnId: string, direction: SortOrder) => void;
}) => {
  const colorVal = useColorModeValue('slate.700', 'slate.250');

  return (
    <Th
      py={3}
      px={6}
      border="none"
      sx={isFirst ? mobileBorderCss : {}}
      width="fit-content"
      position={isFirst ? 'sticky' : 'unset'}
      left={isFirst ? 0 : undefined}
      zIndex={isFirst ? 'docked' : undefined}
      bg="surface"
      borderBottom="1px solid var(--stacks-colors-borderSecondary)"
      role="columnheader"
      aria-sort={sortOrder ? (sortOrder === 'asc' ? 'ascending' : 'descending') : 'none'}
    >
      {typeof headerTitle === 'string' ? ( // TODO: why not also use a custom renderer
        <Flex gap={1.5} alignItems="center" py={4}>
          <Text
            fontWeight="normal"
            whiteSpace="nowrap"
            fontSize="sm"
            color={colorVal}
            textTransform="none"
            letterSpacing="normal"
            fontFamily="instrument"
          >
            {headerTitle}
          </Text>
          {columnDefinition.tooltip && (
            <Tooltip label={columnDefinition.tooltip}>
              <Icon as={Info} size={4} />
            </Tooltip>
          )}
          <SortIcon
            sortable={columnDefinition.sortable}
            sortColumn={sortColumn}
            columnId={columnDefinition.id}
            sortOrder={sortOrder}
            onSort={onSort}
          />
        </Flex>
      ) : (
        headerTitle
      )}
    </Th>
  );
};

export function TableRow<T extends unknown[]>({
  rowData,
  columns,
  rowIndex,
  isFirst,
  isLast,
}: {
  rowData: T;
  columns: ColumnDefinition<T>[];
  rowIndex: number;
  isFirst: boolean;
  isLast: boolean;
}) {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <Tr
      _hover={{
        bg: isHovered ? 'sand.150' : 'inherit',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      sx={{
        '& > td:first-of-type': {
          borderTopLeftRadius: 'xl',
          borderBottomLeftRadius: 'xl',
        },
        '& > td:last-of-type': {
          borderTopRightRadius: 'xl',
          borderBottomRightRadius: 'xl',
        },
      }}
    >
      {columns.map((col, colIndex) => (
        <Td
          key={`table-row-${rowIndex}-col-${colIndex}`}
          py={4}
          px={6}
          sx={{
            ...(colIndex === 0
              ? { ...mobileBorderCss, bg: isHovered ? 'inherit' : 'surface' }
              : {}),
          }}
          position={colIndex === 0 ? 'sticky' : 'unset'}
          left={colIndex === 0 ? 0 : undefined}
          zIndex={colIndex === 0 ? 'docked' : undefined}
        >
          {col.cellRenderer ? (
            col.cellRenderer(col.accessor(rowData))
          ) : (
            <Text whiteSpace="nowrap" overflow="hidden" textOverflow="ellipsis" fontSize="sm">
              {col.accessor(rowData)}
            </Text>
          )}
        </Td>
      ))}
    </Tr>
  );
}

export interface ColumnDefinition<T extends unknown[], R = string> {
  id: string;
  header: string | React.ReactNode;
  tooltip?: string;
  accessor: (row: T) => R;
  sortable?: boolean;
  onSort?: (a: T, b: T) => number;
  cellRenderer?: (value: R) => React.ReactNode;
}

export interface TableProps<T extends unknown[]> {
  title?: string;
  topRight?: React.ReactNode;
  topLeft?: React.ReactNode;
  rowData: T[];
  columnDefinitions: ColumnDefinition<T>[];
}

export function Table<T extends unknown[]>({
  title,
  topRight,
  topLeft,
  rowData,
  columnDefinitions,
}: TableProps<T>) {
  const [sortColumnId, setSortColumnId] = useState<string | undefined>(undefined);
  const [sortDirection, setSortDirection] = useState<SortOrder | undefined>(undefined);

  const [sortedRowData, setSortedRowData] = useState(rowData);

  const onSort = useCallback(
    (columnId: string, sortOrder: SortOrder) => {
      const columnDefinition = columnDefinitions.find(col => col.id === columnId);
      if (!columnDefinition) {
        throw new Error(`Column definition not found for columnId: ${columnId}`);
      }
      if (!columnDefinition.sortable) {
        throw new Error(`Column ${columnId} is not sortable`);
      }
      if (!columnDefinition.onSort) {
        throw new Error(`Column ${columnId} does not have an onSort function`);
      }
      setSortColumnId(columnId);
      setSortDirection(sortOrder);
      setSortedRowData(rowData.sort(columnDefinition.onSort));
    },
    [columnDefinitions, rowData]
  );

  return (
    <ExplorerErrorBoundary
      Wrapper={TableContainer}
      tryAgainButton
    >
      <Suspense
        fallback={
          <TableSkeleton numColumns={columnDefinitions.length} numRows={rowData.length ?? null} />
        }
      >
        {/* <TableProvider initialData={data}> */}
        <TableContainer topRight={topRight} topLeft={topLeft} title={title}>
          <ScrollableBox>
            <StyledTable width="full">
              <Thead>
                <Tr>
                  {columnDefinitions?.map((col, colIndex) => (
                    <TableHeader
                      key={col.id}
                      columnDefinition={col}
                      headerTitle={col.header}
                      sortColumn={sortColumnId}
                      sortOrder={sortDirection}
                      isFirst={colIndex === 0}
                      onSort={onSort}
                    />
                  ))}
                </Tr>
              </Thead>
              <Tbody>
                {sortedRowData?.map((rowData, rowIndex) => (
                  <TableRow
                    key={rowIndex}
                    rowIndex={rowIndex}
                    rowData={rowData}
                    columns={columnDefinitions}
                    isFirst={rowIndex === 0}
                    isLast={rowIndex === sortedRowData.length - 1}
                  />
                ))}
              </Tbody>
            </StyledTable>
          </ScrollableBox>
        </TableContainer>
        {/* </TableProvider> */}
      </Suspense>
    </ExplorerErrorBoundary>
  );
}
