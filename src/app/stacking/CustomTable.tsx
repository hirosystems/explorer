import { useColorModeValue } from '@chakra-ui/react';
import styled from '@emotion/styled';
import { ArrowDown, ArrowUp, ArrowsDownUp } from '@phosphor-icons/react';
import React, { Suspense } from 'react';

import { Section } from '../../common/components/Section';
import { mobileBorderCss } from '../../common/constants/constants';
import { Box } from '../../ui/Box';
import { Flex } from '../../ui/Flex';
import { Icon } from '../../ui/Icon';
import { Table } from '../../ui/Table';
import { Tbody } from '../../ui/Tbody';
import { Td } from '../../ui/Td';
import { Text } from '../../ui/Text';
import { Th } from '../../ui/Th';
import { Thead } from '../../ui/Thead';
import { Tr } from '../../ui/Tr';
import { ScrollableBox } from '../_components/BlockList/ScrollableDiv';
import { ExplorerErrorBoundary } from '../_components/ErrorBoundary';

const StyledTable = styled(Table)`
  tr td {
    border-bottom: none;
  }
`;

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
    >
      {typeof headerTitle === 'string' ? (
        <Flex gap={1} alignItems="center">
          <Text
            fontWeight="medium"
            whiteSpace="nowrap"
            fontSize="xs"
            color={colorVal}
            textTransform="none"
            letterSpacing="normal"
          >
            {headerTitle}
          </Text>
          {sortIcon && (
            <Box
              onClick={() => {
                onSort?.(columnDefinition.id, sortDirection === 'asc' ? 'desc' : 'asc');
              }}
            >
              {sortIcon}
            </Box>
          )}
        </Flex>
      ) : (
        headerTitle
      )}
    </Th>
  );
};

function TableRow({
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
        backgroundColor: 'var(--stacks-colors-hoverBackground)',
      }}
      style={{
        borderTop: isFirst ? 'none' : '',
        borderBottom: isLast ? 'none' : '',
      }}
    >
      {columns.map((col, colIndex) => (
        <Td
          key={`table-row-${rowIndex}-col-${colIndex}`}
          py={3}
          px={6}
          sx={colIndex === 0 ? mobileBorderCss : {}}
          position={colIndex === 0 ? 'sticky' : 'unset'}
          left={colIndex === 0 ? 0 : undefined}
          zIndex={colIndex === 0 ? 'docked' : undefined}
          bg="surface"
        >
          {col.cellRenderer ? (
            col.cellRenderer(col.accessor(rowData[colIndex]))
          ) : (
            <Text
              whiteSpace="nowrap"
              overflow="hidden"
              textOverflow="ellipsis"
              fontSize="sm"
              pl={2}
            >
              {col.accessor(rowData[colIndex])}
            </Text>
          )}
        </Td>
      ))}
    </Tr>
  );
}

export function TableLayout({
  title,
  data,
  columns,
  onSort,
  sortColumn,
  sortDirection,
  topRight,
}: CustomTableProps) {
  return (
    <Section title={title} topRight={topRight} w="full">
      <ScrollableBox>
        <StyledTable width="full">
          <Thead>
            {columns?.map((col, colIndex) => (
              <TableHeader
                key={col.id}
                columnDefinition={col}
                headerTitle={col.header}
                sortColumn={sortColumn}
                sortDirection={sortDirection}
                isFirst={colIndex === 0}
                onSort={onSort}
              />
            ))}
          </Thead>
          <Tbody>
            {data?.map((rowData, rowIndex) => (
              <TableRow
                key={rowIndex}
                rowIndex={rowIndex}
                rowData={rowData}
                columns={columns}
                isFirst={rowIndex === 0}
                isLast={rowIndex === data.length - 1}
              />
            ))}
          </Tbody>
        </StyledTable>
      </ScrollableBox>
    </Section>
  );
}

export interface ColumnDefinition {
  id: string;
  header: string | React.ReactNode;
  accessor: (row: any) => React.ReactNode;
  sortable?: boolean;
  cellRenderer?: (value: any) => React.ReactNode;
}

export interface CustomTableProps {
  title?: string;
  topRight?: React.ReactNode;
  data: any[];
  columns: ColumnDefinition[];
  onSort?: (columnId: string, direction: 'asc' | 'desc') => void;
  sortColumn?: string | null;
  sortDirection?: 'asc' | 'desc';
}

function CustomTable({
  title,
  topRight,
  data,
  columns,
  onSort,
  sortColumn,
  sortDirection,
}: CustomTableProps) {
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
        <TableLayout
          data={data}
          columns={columns}
          onSort={onSort}
          sortColumn={sortColumn}
          sortDirection={sortDirection}
          topRight={topRight}
          title={title}
        />
      </Suspense>
    </ExplorerErrorBoundary>
  );
}

export default CustomTable;
