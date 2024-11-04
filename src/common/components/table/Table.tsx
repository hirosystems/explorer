import { Tooltip } from '@/ui/Tooltip';
import { useColorModeValue } from '@chakra-ui/react';
import { ArrowDown, ArrowUp, ArrowsDownUp, Info } from '@phosphor-icons/react';
import React, { Suspense, useState } from 'react';

import { ExplorerErrorBoundary } from '../../../app/_components/ErrorBoundary';
import { Box } from '../../../ui/Box';
import { Flex } from '../../../ui/Flex';
import { Icon } from '../../../ui/Icon';
import { Td } from '../../../ui/Td';
import { Text } from '../../../ui/Text';
import { Th } from '../../../ui/Th';
import { Tr } from '../../../ui/Tr';
import { mobileBorderCss } from '../../constants/constants';
import { TableLayout } from './TableLayout';

interface SortIconProps {
  sortable: boolean | undefined;
  sortColumn: string | undefined | null;
  columnId: string;
  sortDirection: 'asc' | 'desc' | undefined;
  onSort: ((columnId: string, direction: 'asc' | 'desc') => void) | undefined;
}

function SortIcon({ sortable, sortColumn, columnId, sortDirection, onSort }: SortIconProps) {
  if (!sortable) return null;
  return (
    <Icon
      onClick={() => {
        onSort?.(columnId, sortDirection === 'asc' ? 'desc' : 'asc');
      }}
      as={sortColumn !== columnId ? ArrowsDownUp : sortDirection === 'asc' ? ArrowUp : ArrowDown}
      size={4}
    />
  );
}

export const TableHeader = <T,>({
  columnDefinition,
  sortColumn,
  sortDirection,
  headerTitle,
  isFirst,
  onSort,
}: {
  sortColumn?: string | null;
  sortDirection?: 'asc' | 'desc';
  columnDefinition: ColumnDefinition<T>;
  headerTitle: string | React.ReactNode;
  isFirst: boolean;
  onSort?: (columnId: string, direction: 'asc' | 'desc') => void;
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
      aria-sort={sortDirection ? (sortDirection === 'asc' ? 'ascending' : 'descending') : 'none'}
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
            sortDirection={sortDirection}
            onSort={onSort}
          />
        </Flex>
      ) : (
        headerTitle
      )}
    </Th>
  );
};

export function TableRow<T>({
  rowData,
  columns,
  rowIndex,
  isFirst,
  isLast,
}: {
  rowData: T[];
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
            col.cellRenderer(col.accessor(rowData[colIndex]))
          ) : (
            <Text whiteSpace="nowrap" overflow="hidden" textOverflow="ellipsis" fontSize="sm">
              {col.accessor(rowData[colIndex])}
            </Text>
          )}
        </Td>
      ))}
    </Tr>
  );
}

export interface ColumnDefinition<T = any, R = any> {
  id: string;
  header: string | React.ReactNode;
  tooltip?: string;
  accessor: (value: T) => R;
  sortable?: boolean;
  cellRenderer?: (value: R) => React.ReactNode;
}

export interface TableProps<T> {
  title?: string;
  topRight?: React.ReactNode;
  topLeft?: React.ReactNode;
  rowData: T[];
  columnDefinitions: ColumnDefinition<T>[];
  onSort?: (columnId: string, direction: 'asc' | 'desc') => void;
  sortColumn?: string | null;
  sortDirection?: 'asc' | 'desc';
}

export function Table<T>({
  title,
  topRight,
  topLeft,
  rowData: data,
  columnDefinitions: columns,
  onSort,
  sortColumn,
  sortDirection,
}: TableProps<T>) {
  return (
    <ExplorerErrorBoundary
      // Wrapper={Section}
      // wrapperProps={{
      //   title,
      //   gridColumnStart: ['1', '1', '2'],
      //   gridColumnEnd: ['2', '2', '3'],
      //   minWidth: 0,
      // }}
      tryAgainButton
    >
      <Suspense fallback={<Box>Loading...</Box>}>
        {/* <TableProvider initialData={data}> */}
        <TableLayout // TODO: Move this into this file
          rowData={data}
          columnDefinitions={columns}
          onSort={onSort}
          sortColumn={sortColumn}
          sortDirection={sortDirection}
          topRight={topRight}
          topLeft={topLeft}
          title={title}
        />
        {/* </TableProvider> */}
      </Suspense>
    </ExplorerErrorBoundary>
  );
}
