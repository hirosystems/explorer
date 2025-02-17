import { ScrollableBox } from '@/app/_components/BlockList/ScrollableDiv';
import { Text } from '@/ui/Text';
import { Tooltip } from '@/ui/Tooltip';
import StacksFrowneyIcon from '@/ui/icons/StacksFrowneyIcon';
import { Table as ChakraTable, Flex, Icon, Stack } from '@chakra-ui/react';
import { ArrowDown, ArrowUp, ArrowsDownUp, Info } from '@phosphor-icons/react';
import React, { useEffect, useState } from 'react';

import { ExplorerErrorBoundary } from '../../../app/_components/ErrorBoundary';
import { TableContainer } from './TableContainer';
import { ScrollIndicatorWrapper } from './TableScrollIndicatorWrapper';

const fixedFirstColumnCss = {
  '.has-horizontal-scroll &:before': {
    content: '""',
    position: 'absolute',
    right: 0,
    top: 0,
    width: '2px',
    height: 'full',
    backgroundColor: 'redesignBorderPrimary',
  },
  '.has-horizontal-scroll &:first-of-type::before': {
    content: '""',
    position: 'absolute',
    right: 0,
    width: '2px',
    backgroundColor: 'redesignBorderPrimary',
    top: '-8px', // Accounts for gap between header rows and the other rows
    height: 'calc(calc(100%) + 8px)',
  },
  '&': {
    position: 'sticky',
    left: 0,
    zIndex: 'docked',
    bg: 'surface',
  },
};

type SortOrder = 'asc' | 'desc';

interface SortIconProps {
  sortable: boolean | undefined;
  sortColumn: string | undefined | null;
  columnId: string;
  sortOrder: SortOrder | undefined;
  setSortColumnId: (columnId: string) => void;
  setSortOrder: (sortOrder: SortOrder | undefined) => void;
}

function SortIcon({
  sortable,
  columnId,
  sortColumn,
  sortOrder,
  setSortColumnId,
  setSortOrder,
}: SortIconProps) {
  if (!sortable) return null;
  return (
    <Flex
      justifyContent="center"
      alignItems="center"
      bg="surfacePrimary"
      borderRadius="redesign.xs"
      p={1}
      className="group"
    >
      <Icon
        onClick={() => {
          setSortColumnId(columnId);
          setSortOrder(sortOrder ? (sortOrder === 'asc' ? undefined : 'asc') : 'desc');
        }}
        h={3}
        w={3}
        cursor="pointer"
        color="iconSecondary"
        _groupHover={{
          color: 'iconPrimary',
        }}
      >
        {sortColumn !== columnId || !sortOrder ? (
          <ArrowsDownUp />
        ) : sortOrder === 'asc' ? (
          <ArrowUp />
        ) : (
          <ArrowDown />
        )}
      </Icon>
    </Flex>
  );
}

export function TableHeader<R, V = R[keyof R]>({
  columnDefinition,
  sortColumn,
  sortOrder,
  headerTitle,
  columnIndex,
  setSortColumnId,
  setSortOrder,
  hasFixedFirstColumn,
  numColumns,
}: {
  sortColumn?: string | null;
  sortOrder?: SortOrder;
  columnDefinition: ColumnDefinition<R, V>;
  headerTitle: string | React.ReactNode;
  columnIndex: number;
  setSortColumnId: (columnId: string) => void;
  setSortOrder: (sortOrder: SortOrder | undefined) => void;
  hasFixedFirstColumn?: boolean;
  numColumns: number;
}) {
  const isFirstColumn = columnIndex === 0;
  return (
    <ChakraTable.ColumnHeader
      py={3}
      px={[2, 2, 2, `clamp(12px, calc(48px / ${numColumns}), 16px)`]}
      border="none"
      borderBottom="1px solid var(--stacks-colors-surface-secondary)"
      css={hasFixedFirstColumn && isFirstColumn ? fixedFirstColumnCss : {}}
      width="fit-content"
      role="columnheader"
      aria-sort={sortOrder ? (sortOrder === 'asc' ? 'ascending' : 'descending') : 'none'}
      minH={13}
    >
      <Flex
        w="fit-content"
        gap={1.5}
        alignItems="center"
        py={1}
        pl={1}
        pr={1.5}
        _hover={{
          bg: 'surfaceSecondary',
        }}
        borderRadius="redesign.md"
        className="column-header-content"
      >
        {typeof headerTitle === 'string' ? (
          <Text
            fontWeight="medium"
            whiteSpace="nowrap"
            fontSize="sm"
            color={{
              _light: 'slate.700',
              _dark: 'slate.250',
            }}
            textTransform="none"
            letterSpacing="normal"
            fontFamily="instrument"
            css={{
              '& .column-header-content:hover': {
                color: 'textPrimary',
              },
            }}
          >
            {headerTitle}
          </Text>
        ) : (
          headerTitle
        )}
        {columnDefinition.tooltip && (
          <Tooltip content={columnDefinition.tooltip}>
            <Icon h={4} w={4} color="iconSecondary">
              <Info />
            </Icon>
          </Tooltip>
        )}
        <SortIcon
          sortable={!!columnDefinition.onSort}
          sortColumn={sortColumn}
          columnId={columnDefinition.id}
          sortOrder={sortOrder}
          setSortColumnId={setSortColumnId}
          setSortOrder={setSortOrder}
        />
      </Flex>
    </ChakraTable.ColumnHeader>
  );
}

export function TableRow<R, V = R[keyof R]>({
  rowData,
  columnDefinitions,
  rowIndex,
  hasFixedFirstColumn,
}: {
  rowData: R;
  columnDefinitions: ColumnDefinition<R, V>[];
  rowIndex: number;
  hasFixedFirstColumn?: boolean;
}) {
  return (
    <ChakraTable.Row
      css={{
        '& > td:first-of-type': {
          borderTopLeftRadius: 'redesign.md',
          borderBottomLeftRadius: 'redesign.md',
        },
        '& > td:last-of-type': {
          borderTopRightRadius: 'redesign.md',
          borderBottomRightRadius: 'redesign.md',
        },
      }}
      className="group"
      minH={13}
    >
      {columnDefinitions.map((colDef, colIndex) => {
        const isFirstColumn = colIndex === 0;
        return (
          <ChakraTable.Cell
            key={`table-row-${rowIndex}-col-${colIndex}`}
            py={3}
            px={[2, 2, 2, `clamp(12px, calc(48px / ${columnDefinitions.length}), 16px)`]}
            css={{
              ...(hasFixedFirstColumn && isFirstColumn
                ? {
                    ...fixedFirstColumnCss,
                    '&:hover': {
                      backgroundColor: 'inherit',
                    },
                    backgroundColor: 'surface',
                  }
                : {}),
            }}
            _groupHover={{
              bg: 'surfacePrimary',
            }}
          >
            {colDef.cellRenderer(colDef.accessor(rowData), rowData)}
          </ChakraTable.Cell>
        );
      })}
    </ChakraTable.Row>
  );
}

export type CellRenderer<R, V> = (value: V, row: R) => React.ReactNode;

/**
 * Defines the structure of a table column
 * @template T - The type of the row data object
 * @template K - The keys/properties available in T (must be valid keys of T)
 * @template R - The type of the value at T[K], defaults to T[K]
 */
export interface ColumnDefinition<R, V = R[keyof R]> {
  id: string;
  header: string | React.ReactNode;
  tooltip?: string;
  accessor: (row: R) => V;
  onSort?: (a: R, b: R) => number;
  cellRenderer: CellRenderer<R, V>;
}

export interface TableProps<R> {
  rowData: R[];
  columnDefinitions: ColumnDefinition<R>[];
  onSort?: (columnId: string, sortOrder: SortOrder | undefined) => Promise<R[]>;
  isLoading?: boolean;
  suspenseWrapper?: (table: React.ReactNode) => React.ReactNode;
  tableContainerWrapper?: (table: React.ReactNode) => React.ReactNode;
  hasFixedFirstColumn?: boolean;
  hasScrollIndicator?: boolean;
  bannerRow?: React.ReactElement<typeof ChakraTable.Row>;
}

export function Table<R>({
  rowData,
  columnDefinitions,
  bannerRow,
  hasScrollIndicator,
  hasFixedFirstColumn,
  tableContainerWrapper,
  suspenseWrapper,
  onSort, // For server-side sorting
  isLoading,
}: TableProps<R>) {
  const [sortColumnId, setSortColumnId] = useState<string | undefined>(undefined);
  const [sortOrder, setSortOrder] = useState<SortOrder | undefined>(undefined);
  const [sortedRowData, setSortedRowData] = useState(rowData);

  // Handles table sorting when sort column or order changes.
  useEffect(() => {
    if (!sortColumnId || !sortOrder) {
      setSortedRowData(rowData); // If no sort column or order, show the original unsorted data
      return;
    }
    const columnDefinition = columnDefinitions.find(col => col.id === sortColumnId);
    if (!columnDefinition) {
      throw new Error(`Column definition not found for columnId: ${sortColumnId}`);
    }
    if (!!onSort) {
      // Let the parent component handle the loading state and data updates
      onSort(sortColumnId, sortOrder).then(setSortedRowData);
    } else {
      if (!columnDefinition.onSort) {
        throw new Error(`Column ${sortColumnId} does not have an onSort function`);
      }
      console.log({ sortOrder, sortColumnId });
      setSortedRowData(
        sortOrder
          ? [...rowData].sort((a, b) => {
              const result = columnDefinition.onSort!(a, b);
              return sortOrder === 'asc' ? result : -result;
            })
          : rowData
      );
    }
  }, [sortColumnId, sortOrder, rowData, columnDefinitions, onSort]);

  if (rowData.length === 0) {
    return (
      <Flex
        justifyContent="center"
        alignItems="center"
        height="800px"
        w="full"
        borderRadius="2xl"
        borderColor="newBorderSecondary"
        borderWidth={1}
        borderStyle="solid"
        bg="surface"
      >
        <Stack alignItems="center" gap={6}>
          <Icon h={16} w={16}>
            <StacksFrowneyIcon />
          </Icon>
          <Stack gap={2} alignItems="center">
            <Text fontSize="2xl" fontWeight="medium" color="textPrimary">
              No results found
            </Text>
            <Text fontSize="md" color="textSecondary">
              Try modifying filters applied.
            </Text>
          </Stack>
        </Stack>
      </Flex>
    );
  }

  let content: React.ReactNode = (
    <ChakraTable.Root
      width="full"
      css={{
        '& td': {
          borderBottom: 'none',
        },
        '& tbody': {
          position: 'relative',
          top: 2,
        },
      }}
      overflowX="auto"
      className="table-root"
    >
      <ChakraTable.Header>
        <ChakraTable.Row>
          {columnDefinitions?.map((col, colIndex) => (
            <TableHeader
              key={col.id}
              columnDefinition={col}
              headerTitle={col.header}
              sortColumn={sortColumnId}
              sortOrder={sortOrder}
              setSortColumnId={setSortColumnId}
              setSortOrder={setSortOrder}
              columnIndex={colIndex}
              hasFixedFirstColumn={hasFixedFirstColumn}
              numColumns={columnDefinitions.length}
            />
          ))}
        </ChakraTable.Row>
      </ChakraTable.Header>
      <ChakraTable.Body>
        {bannerRow}
        {sortedRowData?.map((rowData, rowIndex) => (
          <TableRow
            key={rowIndex}
            rowIndex={rowIndex}
            rowData={rowData}
            columnDefinitions={columnDefinitions}
            hasFixedFirstColumn={hasFixedFirstColumn}
          />
        ))}
      </ChakraTable.Body>
    </ChakraTable.Root>
  );

  if (hasScrollIndicator) {
    content = <ScrollIndicatorWrapper>{content}</ScrollIndicatorWrapper>;
  }

  if (hasFixedFirstColumn) {
    content = <ScrollableBox>{content}</ScrollableBox>;
  }

  if (tableContainerWrapper) {
    content = tableContainerWrapper(content);
  }

  if (suspenseWrapper) {
    content = suspenseWrapper(content);
  }

  return (
    <ExplorerErrorBoundary Wrapper={TableContainer} tryAgainButton>
      {content}
    </ExplorerErrorBoundary>
  );
}
