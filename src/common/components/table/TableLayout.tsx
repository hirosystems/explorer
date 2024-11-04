import { Box } from '@/ui/Box';
import { Flex, FlexProps } from '@/ui/Flex';
import { Stack, useColorModeValue } from '@chakra-ui/react';
import styled from '@emotion/styled';
import { ReactNode } from 'react';

import { ScrollableBox } from '../../../app/_components/BlockList/ScrollableDiv';
import { Table } from '../../../ui/Table';
import { Tbody } from '../../../ui/Tbody';
import { Text } from '../../../ui/Text';
import { Thead } from '../../../ui/Thead';
import { Tr } from '../../../ui/Tr';
import { Card } from '../Card';
import { TableHeader, TableProps, TableRow } from './Table';

const StyledTable = styled(Table)`
  tr td {
    border-bottom: none;
  }
`;

function TableContainerHeader({
  topLeft,
  topRight,
  title,
}: {
  topLeft?: string | ReactNode;
  topRight?: ReactNode;
  title?: string | ReactNode;
}) {
  const titleColor = useColorModeValue('slate.900', 'white');

  if (!title && !topLeft && !topRight) {
    return null;
  }

  return (
    <Flex justifyContent="space-between" alignItems="center">
      <Flex
        alignItems="flex-start"
        justifyContent="space-between"
        flexShrink={0}
        direction={['column', 'row']}
        gap={4}
      >
        {title ? (
          <Text color={titleColor} fontWeight="normal" fontSize="3.5xl">
            {title}
          </Text>
        ) : topLeft ? (
          topLeft
        ) : null}
      </Flex>
      {topRight && (
        <Flex justifyContent="flex-end" alignItems="center">
          {topRight}
        </Flex>
      )}
    </Flex>
  );
}

interface TableContainerProps extends FlexProps {
  topLeft?: ReactNode;
  topRight?: ReactNode;
  title?: string;
}

function TableContainer({ topLeft, topRight, title, children, ...rest }: TableContainerProps) {
  return (
    <Stack gap={7} w="full">
      <TableContainerHeader topLeft={topLeft} topRight={topRight} title={title} />
      <Card h="fit-content" w="full" px={6} {...rest}>
        <Box position={'relative'}>{children}</Box>
      </Card>
    </Stack>
  );
}

export function TableLayout<T>({
  title,
  rowData: data,
  columnDefinitions: columns,
  onSort,
  sortColumn,
  sortDirection,
  topRight,
}: TableProps<T>) {
  return (
    <TableContainer title={title} topRight={topRight}>
      <ScrollableBox>
        <StyledTable width="full">
          <Thead>
            <Tr>
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
            </Tr>
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
    </TableContainer>
  );
}
