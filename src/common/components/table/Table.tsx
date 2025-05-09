import { Text } from '@/ui/Text';
import { Tooltip } from '@/ui/Tooltip';
import StacksFrowneyIcon from '@/ui/icons/StacksFrowneyIcon';
import { Table as ChakraTable, Flex, Icon, Spinner, Stack } from '@chakra-ui/react';
import { ArrowDown, ArrowUp, ArrowsDownUp, Info, WarningOctagon } from '@phosphor-icons/react';
import {
  Column,
  ColumnDef,
  ColumnPinningState,
  PaginationState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import React, { type JSX, useEffect, useMemo, useState } from 'react';

import { ExplorerErrorBoundary } from '../../../app/_components/ErrorBoundary';
import { DefaultTableColumnHeader } from './TableComponents';
import { TableContainer } from './TableContainer';
import { TablePaginationControls } from './TablePaginationControls';

declare module '@tanstack/react-table' {
  interface ColumnMeta<TData extends unknown, TValue> {
    tooltip?: string;
    isPinned?: 'left' | 'right' | false;
  }
}

const TABLE_CELL_MIN_PADDING = 'var(--stacks-spacing-3)';
const TABLE_CELL_MAX_PADDING = 'var(--stacks-spacing-4)';
const TABLE_CELL_BASE_PADDING = 'var(--stacks-spacing-12)';
function getTableCellPadding<T>(columns: ColumnDef<T>[]) {
  return `clamp(${TABLE_CELL_MIN_PADDING}, calc(${TABLE_CELL_BASE_PADDING} / ${columns.length}), ${TABLE_CELL_MAX_PADDING})`;
}

export const getCommonPinningStyles = <T,>(column: Column<T>) => {
  const isPinned = column.getIsPinned();
  const isLastLeftPinnedColumn = isPinned === 'left' && column.getIsLastColumn('left');

  if (!isPinned) {
    return {};
  }

  return {
    bg: 'surface',
    left: isPinned === 'left' ? `${column.getStart('left')}px` : undefined,
    right: isPinned === 'right' ? `${column.getAfter('right')}px` : undefined,
    opacity: 1,
    position: isPinned ? 'sticky' : 'relative',
    zIndex: isPinned ? 1 : 0,
    ...(isLastLeftPinnedColumn && {
      '&::before': {
        content: '""',
        position: 'absolute',
        right: 0,
        top: 0,
        width: '2px',
        height: 'full',
        backgroundColor: 'redesignBorderPrimary',
      },
      'td&:first-of-type::before': {
        content: '""',
        position: 'absolute',
        right: 0,
        top: '-8px',
        width: '2px',
        height: 'calc(100% + 8px)',
        backgroundColor: 'redesignBorderPrimary',
      },
    }),
  };
};

interface SortIconProps {
  isSortable: boolean;
  sortDirection: boolean | 'asc' | 'desc';
  onSort: () => void;
}

function SortIcon({ isSortable, sortDirection, onSort }: SortIconProps) {
  if (!isSortable) return null;

  return (
    <Flex
      justifyContent="center"
      alignItems="center"
      bg="surfacePrimary"
      borderRadius="redesign.xs"
      p={1}
    >
      <Icon
        h={3}
        w={3}
        color="iconSecondary"
        _groupHover={{
          color: 'iconPrimary',
        }}
      >
        {!sortDirection ? <ArrowsDownUp /> : sortDirection === 'asc' ? <ArrowUp /> : <ArrowDown />}
      </Icon>
    </Flex>
  );
}

export type TableProps<T> = {
  data: T[];
  columns: ColumnDef<T>[];
  onSort?: (columnId: string, sortDirection: 'asc' | 'desc' | undefined) => Promise<T[]>;
  isLoading?: boolean;
  suspenseWrapper?: (table: JSX.Element) => JSX.Element;
  tableContainerWrapper?: (table: JSX.Element) => JSX.Element;
  scrollIndicatorWrapper?: (table: JSX.Element) => JSX.Element;
  bannerRow?: React.ReactElement<typeof ChakraTable.Row> | null;
  error?: string;
  pagination?: {
    manualPagination: boolean;
    pageIndex: number;
    pageSize: number;
    totalRows: number;
    onPageChange: (pagination: PaginationState) => void;
    onPageSizeChange?: (pageSize: PaginationState) => void;
  };
};

const ErrorTable = ({ error }: { error: string }) => {
  return (
    <Stack justifyContent="center" alignItems="center" h="full" w="full" flex={1} gap={3}>
      <Icon h={8} w={8} color="iconError">
        <WarningOctagon />
      </Icon>
      <Text fontSize="md" fontWeight="medium" color="textError">
        {error ?? 'An error occurred'}
      </Text>
    </Stack>
  );
};

const EmptyFilteredTable = () => {
  // This isn't used now, but the plan is to use this once I start implementing filtering
  return (
    <Stack justifyContent="center" alignItems="center" h="full" w="full" flex={1} gap={6}>
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
  );
};

const EmptyTable = ({ message }: { message?: string }) => {
  return (
    <Stack justifyContent="center" alignItems="center" h="full" w="full" flex={1}>
      <Text fontSize="2xl" color="textPrimary">
        {message ?? 'No results found'}
      </Text>
    </Stack>
  );
};

const LoadingTable = () => {
  return (
    <Stack justifyContent="center" alignItems="center" h="full" w="full" flex={1}>
      <Icon h={16} w={16}>
        <Spinner size="md" />
      </Icon>
    </Stack>
  );
};

export const getColumnPinningState = <T,>(columns: ColumnDef<T>[]): ColumnPinningState => {
  const left: string[] = [];
  const right: string[] = [];

  columns.forEach(column => {
    if (!column.id) return;
    const columnId = column.id;
    if (column.meta?.isPinned === 'left') {
      left.push(columnId);
    } else if (column.meta?.isPinned === 'right') {
      right.push(columnId);
    }
  });

  return { left, right };
};

export function Table<T>({
  data,
  columns,
  onSort,
  isLoading,
  suspenseWrapper = (table: JSX.Element) => table,
  tableContainerWrapper = (table: JSX.Element) => table,
  scrollIndicatorWrapper = (table: JSX.Element) => table,
  bannerRow,
  error,
  pagination,
}: TableProps<T>): JSX.Element {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [tableData, setTableData] = useState(data);

  const columnPinning = useMemo(() => getColumnPinningState(columns), [columns]);

  const table = useReactTable({
    data: tableData,
    columns,
    ...(pagination?.manualPagination ? { rowCount: pagination.totalRows } : {}), // no need to pass pageCount or rowCount with client-side pagination as it is calculated automatically
    state: {
      sorting,
      columnPinning,
      ...(pagination && {
        pagination: {
          pageIndex: pagination.pageIndex,
          pageSize: pagination.pageSize,
        },
      }),
    },
    onSortingChange: async updater => {
      if (typeof updater === 'function') {
        const newSorting = updater(sorting);
        setSorting(newSorting);

        if (onSort && newSorting.length > 0) {
          const [{ id, desc }] = newSorting;
          const sortedData = await onSort(id, desc ? 'desc' : 'asc');
          setTableData(sortedData);
        }
      }
    },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualPagination: pagination?.manualPagination ?? false,
    ...(pagination
      ? pagination?.manualPagination
        ? {}
        : { getPaginationRowModel: getPaginationRowModel() }
      : {}),
    ...(pagination && !pagination.manualPagination
      ? {
          onPaginationChange: updater => {
            const newPagination =
              typeof updater === 'function' ? updater(table.getState().pagination) : updater;
            pagination.onPageChange(newPagination);
          },
        }
      : {}),
  });

  useEffect(() => {
    setTableData(data);
  }, [data]);

  if (error) {
    return tableContainerWrapper(<ErrorTable error={error} />);
  }

  if (isLoading) {
    return tableContainerWrapper(<LoadingTable />);
  }

  if (tableData.length === 0) {
    return tableContainerWrapper(<EmptyTable />);
  }

  let content: React.ReactNode = (
    <ChakraTable.Root
      width="full"
      css={{
        '& td': {
          borderBottom: 'none',
        },
      }}
      overflowX="auto"
      className="table-root"
    >
      <ChakraTable.Header>
        {table.getHeaderGroups().map(headerGroup => (
          <ChakraTable.Row key={headerGroup.id} bg="transparent">
            {headerGroup.headers.map((header, columnIndex) => {
              const { column } = header;
              const sortDirection = column.getIsSorted();
              return (
                <ChakraTable.ColumnHeader
                  key={header.id}
                  css={{ ...getCommonPinningStyles(column) }}
                  py={{
                    base: 2,
                    lg: getTableCellPadding(columns),
                  }}
                  px={{
                    base: 2,
                    lg: getTableCellPadding(columns),
                  }}
                  borderBottom="1px solid"
                  borderColor="redesignBorderSecondary"
                  width="full"
                  role="columnheader"
                  aria-sort={
                    sortDirection ? (sortDirection === 'asc' ? 'ascending' : 'descending') : 'none'
                  }
                  minH={13}
                >
                  <Flex
                    w="full"
                    gap={1.5}
                    alignItems="center"
                    py={1}
                    pl={1}
                    pr={1.5}
                    {...(header.column.getCanSort() && {
                      _hover: {
                        bg: 'surfaceSecondary',
                      },
                    })}
                    borderRadius="redesign.md"
                    className="column-header-content group"
                    cursor={header.column.getCanSort() ? 'pointer' : 'default'}
                    onClick={() => {
                      if (!header.column.getCanSort()) {
                        return;
                      }
                      header.column.toggleSorting();
                    }}
                  >
                    {typeof header.column.columnDef.header === 'string' ? (
                      <DefaultTableColumnHeader header={header}>
                        {flexRender(header.column.columnDef.header, header.getContext())}
                      </DefaultTableColumnHeader>
                    ) : (
                      flexRender(header.column.columnDef.header, header.getContext())
                    )}
                    {header.column.columnDef.meta?.tooltip && (
                      <Tooltip content={header.column.columnDef.meta.tooltip}>
                        <Icon h={4} w={4} color="iconSecondary">
                          <Info />
                        </Icon>
                      </Tooltip>
                    )}
                    <SortIcon
                      isSortable={header.column.getCanSort()}
                      sortDirection={sortDirection}
                      onSort={() => header.column.toggleSorting()}
                    />
                  </Flex>
                </ChakraTable.ColumnHeader>
              );
            })}
          </ChakraTable.Row>
        ))}
      </ChakraTable.Header>
      <ChakraTable.Body>
        <ChakraTable.Row key={'empty-gap-row'} bg="transparent" h={2} />
        {bannerRow}
        {table.getRowModel().rows.map((row, rowIndex) => (
          <ChakraTable.Row
            key={row.id}
            bg="transparent"
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
            {row.getVisibleCells().map((cell, columnIndex) => (
              <ChakraTable.Cell
                key={cell.id}
                py={3}
                px={[2, 2, 2, `clamp(12px, calc(48px / ${columns.length}), 16px)`]}
                css={{ ...getCommonPinningStyles(cell.column) }}
                _groupHover={{
                  bg: 'surfacePrimary',
                }}
              >
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </ChakraTable.Cell>
            ))}
          </ChakraTable.Row>
        ))}
      </ChakraTable.Body>
    </ChakraTable.Root>
  );

  content = tableContainerWrapper(scrollIndicatorWrapper(suspenseWrapper(content)));

  return (
    <ExplorerErrorBoundary Wrapper={TableContainer} tryAgainButton>
      <Stack gap={0} alignItems="center" w="full" className="table-content-container">
        {content}
        {pagination && (
          <TablePaginationControls
            pageIndex={pagination.pageIndex}
            pageSize={pagination.pageSize}
            totalRows={pagination.totalRows}
            onPageChange={pagination.onPageChange}
            onPageSizeChange={pagination.onPageSizeChange}
          />
        )}
      </Stack>
    </ExplorerErrorBoundary>
  );
}
