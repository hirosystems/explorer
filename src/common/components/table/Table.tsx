import { Text } from '@/ui/Text';
import { Tooltip } from '@/ui/Tooltip';
import StacksFrowneyIcon from '@/ui/icons/StacksFrowneyIcon';
import { Table as ChakraTable, Flex, Icon, Spinner, Stack } from '@chakra-ui/react';
import { ArrowDown, ArrowUp, ArrowsDownUp, Info, WarningOctagon } from '@phosphor-icons/react';
import {
  Column,
  ColumnDef,
  ColumnPinningState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import React, { useEffect, useMemo, useState } from 'react';

import { ExplorerErrorBoundary } from '../../../app/_components/ErrorBoundary';
import { TableContainer } from './TableContainer';
import { ScrollIndicatorWrapper } from './TableScrollIndicatorWrapper';

declare module '@tanstack/react-table' {
  interface ColumnMeta<TData extends unknown, TValue> {
    tooltip?: string;
    isPinned?: 'left' | 'right' | false;
  }
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
  suspenseWrapper?: (table: React.ReactNode) => React.ReactNode;
  tableContainerWrapper?: (table: React.ReactNode) => React.ReactNode;
  hasScrollIndicator?: boolean;
  bannerRow?: React.ReactElement<typeof ChakraTable.Row>;
  error?: string;
};

const ErrorTable = ({ error }: { error: string }) => {
  return (
    <Flex justifyContent="center" alignItems="center" h="full" w="full">
      <Stack alignItems="center" gap={3}>
        <Icon h={8} w={8} color="iconError">
          <WarningOctagon />
        </Icon>
        <Text fontSize="md" fontWeight="medium" color="textError">
          {error ?? 'An error occurred'}
        </Text>
      </Stack>
    </Flex>
  );
};

const EmptyFilteredTable = () => {
  // This isn't used now, but the plan is to use this once I start implementing filtering
  return (
    <Flex justifyContent="center" alignItems="center" h="full" w="full">
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
};

const EmptyTable = ({ message }: { message?: string }) => {
  return (
    <Flex justifyContent="center" alignItems="center" h="full" w="full">
      <Text fontSize="2xl" color="textPrimary">
        {message ?? 'No results found'}
      </Text>
    </Flex>
  );
};

const LoadingTable = () => {
  return (
    <Flex justifyContent="center" alignItems="center" h="full" w="full">
      <Icon h={16} w={16}>
        <Spinner size="md" />
      </Icon>
    </Flex>
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
  suspenseWrapper,
  tableContainerWrapper,
  hasScrollIndicator,
  bannerRow,
  error,
}: TableProps<T>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [tableData, setTableData] = useState(data);

  const columnPinning = useMemo(() => getColumnPinningState(columns), [columns]);

  const table = useReactTable({
    data: tableData,
    columns,
    state: {
      sorting,
      columnPinning,
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
  });

  useEffect(() => {
    setTableData(data);
  }, [data]);

  if (error) {
    return <ErrorTable error={error} />;
  }

  if (isLoading) {
    return <LoadingTable />;
  }

  if (tableData.length === 0) {
    return <EmptyTable />;
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
        {table.getHeaderGroups().map(headerGroup => (
          <ChakraTable.Row key={headerGroup.id}>
            {headerGroup.headers.map((header, columnIndex) => {
              const { column } = header;
              const sortDirection = column.getIsSorted();
              return (
                <ChakraTable.ColumnHeader
                  key={header.id}
                  css={{ ...getCommonPinningStyles(column) }}
                  py={3}
                  px={[2, 2, 2, `clamp(12px, calc(48px / ${columns.length}), 16px)`]}
                  border="none"
                  borderBottom="1px solid var(--stacks-colors-surface-secondary)"
                  width="fit-content"
                  role="columnheader"
                  aria-sort={
                    sortDirection ? (sortDirection === 'asc' ? 'ascending' : 'descending') : 'none'
                  }
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
                      <Text
                        fontWeight="medium"
                        whiteSpace="nowrap"
                        fontSize="sm"
                        color={'textSecondary'}
                        textTransform="none"
                        letterSpacing="normal"
                        fontFamily="instrument"
                        css={{
                          '& .column-header-content:hover': {
                            color: 'textPrimary',
                          },
                        }}
                        _groupHover={{
                          color: 'textPrimary',
                        }}
                      >
                        {flexRender(header.column.columnDef.header, header.getContext())}
                      </Text>
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
        {bannerRow}
        {table.getRowModel().rows.map((row, rowIndex) => (
          <ChakraTable.Row
            key={row.id}
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

  if (hasScrollIndicator) {
    content = <ScrollIndicatorWrapper>{content}</ScrollIndicatorWrapper>;
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
