import { useCallback, useMemo, useState } from 'react';

import { Text } from '@/ui/Text';
import { Flex, Icon } from '@chakra-ui/react';
import { ColumnDefinition } from '../../common/components/table/Table';
import { TableWithCursorPagination } from '../../common/components/table/TableWithCursorPagination';
import BitcoinIcon from '../../ui/icons/BitcoinIcon';
import StxIcon from '../../ui/icons/StxIcon';

type PreviousCyclesData = [
  number,
  {
    bitcoin: number;
    stx: number;
  },
  {
    bitcoin: number;
    stx: number;
  },
  string,
  string,
  string,
  number,
  string,
  string,
  string,
];

export function PreviousCyclesTable() {
  const rowData: PreviousCyclesData[] = useMemo(
    () =>
      Array.from({ length: 10 }, (_, index) => index + 1).map((row, i) => [
        i,
        {
          bitcoin: 42946,
          stx: 784946,
        },
        {
          bitcoin: 42946,
          stx: 784946,
        },
        '22',
        '245',
        '67',
        118432860,
        '35.1 BTC',
        '7.5%',
        '100,000 STX',
      ]),
    []
  );
  const columnDefinitions: ColumnDefinition[] = useMemo(
    () => [
      { id: 'Cycle', header: 'Cycle', accessor: (val: any) => val, sortable: true },
      {
        id: 'Started',
        header: 'Started',
        accessor: (val: any) => val,
        sortable: false,
        cellRenderer: (val: any) => {
          return (
            <Flex gap={2}>
              <Flex gap={1} alignItems="center">
                <Icon h={2} w={2}>
                  <BitcoinIcon />
                </Icon>
                <Text fontSize="sm">{val.bitcoin}</Text>
              </Flex>
              <Flex gap={1} alignItems="center">
                <Icon h={2} w={2}>
                  <StxIcon />
                </Icon>
                <Text fontSize="sm">{val.stx}</Text>
              </Flex>
            </Flex>
          );
        },
      },
      {
        id: 'Ended',
        header: 'Ended',
        accessor: (val: any) => val,
        sortable: false,
        cellRenderer: (val: any) => {
          return (
            <Flex gap={2}>
              <Flex gap={1} alignItems="center">
                <Icon  h={2} w={2}>
                  <BitcoinIcon />
                </Icon>
                <Text fontSize="sm">{val.bitcoin}</Text>
              </Flex>
              <Flex gap={1} alignItems="center">
                <Icon  h={2} w={2}>
                  <StxIcon />
                </Icon>
                <Text fontSize="sm">{val.stx}</Text>
              </Flex>
            </Flex>
          );
        },
      },
      { id: 'Pools', header: 'Pools', accessor: (val: any) => val, sortable: true },
      {
        id: 'Solo Stackers',
        header: 'Solo Stackers',
        accessor: (val: any) => val,
        sortable: true,
      },
      {
        id: 'Signers',
        header: 'Signers',
        accessor: (val: any) => val,
        sortable: true,
      },
      {
        id: 'Amount stacked',
        header: 'Amount stacked',
        accessor: (val: any) => val,
        sortable: true,
        cellRenderer: (val: any) => {
          return (
            <Flex gap={1} alignItems="center" flexWrap="nowrap">
              <Text fontSize="sm" whiteSpace="nowrap">
                {`${val} STX`}
              </Text>
              <Text fontSize="sm" color="textSubdued">
                {`(12.3M)`}
              </Text>
            </Flex>
          );
        },
      },
      { id: 'Rewards', header: 'Rewards', accessor: (val: any) => val, sortable: true },
      { id: 'APY', header: 'APY', accessor: (val: any) => val, sortable: true },
      {
        id: 'Minimum to stack',
        header: 'Minimum to stack',
        accessor: (val: any) => val,
        sortable: true,
      },
    ],
    []
  );

  const [sortColumn, setSortColumn] = useState<null | string>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const onSort = useCallback((columnId: string, newSortDirection: 'asc' | 'desc') => {
    setSortColumn(columnId);
    setSortDirection(newSortDirection);
  }, []);

  return (
    <TableWithCursorPagination
      title="Previous Cycles"
      topRight={null}
      rowData={rowData}
      columnDefinitions={columnDefinitions}
      onSort={onSort}
      sortColumn={sortColumn}
      sortDirection={sortDirection}
      pageSize={10}
      fetchNextPage={async () => ({
        data: [], // TODO: Replace with actual data fetching logic
        nextCursor: null,
      })}
    />
  );
}
