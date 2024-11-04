import { Tooltip } from '@/ui/Tooltip';
import { useColorModeValue } from '@chakra-ui/react';
import { ArrowDown, ArrowUp, ArrowsDownUp, Info } from '@phosphor-icons/react';
import React, { Suspense } from 'react';

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

export const TableHeader = ({
  columnDefinition,
  sortColumn,
  sortDirection,
  headerTitle,
  isFirst,
  onSort,
}: {
  sortColumn?: string | null;
  sortDirection?: 'asc' | 'desc';
  columnDefinition: ColumnDefinition;
  headerTitle: string | React.ReactNode;
  isFirst: boolean;
  onSort?: (columnId: string, direction: 'asc' | 'desc') => void;
}) => {
  const colorVal = useColorModeValue('slate.700', 'slate.250');

  const sortIcon = columnDefinition.sortable ? (
    sortColumn !== columnDefinition.id ? (
      <Icon as={ArrowsDownUp} size={4} />
    ) : sortDirection === 'asc' ? (
      <Icon as={ArrowUp} size={4} />
    ) : (
      <Icon as={ArrowDown} size={4} />
    )
  ) : null;

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
          {sortIcon && (
            <Box
              onClick={() => {
                onSort?.(columnDefinition.id, sortDirection === 'asc' ? 'desc' : 'asc');
              }}
              p={1}
              bg="sand.150"
              borderRadius="md"
            >
              <Flex alignItems="center" justifyContent="center" h={4} w={4}>
                {sortIcon}
              </Flex>
            </Box>
          )}
        </Flex>
      ) : (
        headerTitle
      )}
    </Th>
  );
};

export function TableRow({
  rowData,
  columns,
  rowIndex,
  isFirst,
  isLast,
}: {
  rowData: any;
  columns: ColumnDefinition[];
  rowIndex: number;
  isFirst: boolean;
  isLast: boolean;
}) {
  return (
    <Tr
      _hover={{
        bg: 'sand.150',
      }}
      sx={{
        '& > td:first-of-type': {
          borderTopLeftRadius: '12px',
          borderBottomLeftRadius: '12px',
        },
        '& > td:last-of-type': {
          borderTopRightRadius: '12px',
          borderBottomRightRadius: '12px',
        },
      }}
    >
      {columns.map((col, colIndex) => (
        <Td
          key={`table-row-${rowIndex}-col-${colIndex}`}
          py={4}
          px={6}
          sx={colIndex === 0 ? mobileBorderCss : {}} // TODO: this might not be the right style
          position={colIndex === 0 ? 'sticky' : 'unset'}
          left={colIndex === 0 ? 0 : undefined}
          zIndex={colIndex === 0 ? 'docked' : undefined}
          bg="inherit"
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

export interface ColumnDefinition {
  id: string;
  header: string | React.ReactNode;
  tooltip?: string;
  accessor: (value: any) => any;
  sortable?: boolean;
  cellRenderer?: (value: any) => React.ReactNode;
}

export interface TableProps {
  title?: string;
  topRight?: React.ReactNode;
  topLeft?: React.ReactNode;
  rowData: any[];
  columnDefinitions: ColumnDefinition[];
  onSort?: (columnId: string, direction: 'asc' | 'desc') => void;
  sortColumn?: string | null;
  sortDirection?: 'asc' | 'desc';
}

export function Table({
  title,
  topRight,
  topLeft,
  rowData: data,
  columnDefinitions: columns,
  onSort,
  sortColumn,
  sortDirection,
}: TableProps) {
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
      </Suspense>
    </ExplorerErrorBoundary>
  );
}
