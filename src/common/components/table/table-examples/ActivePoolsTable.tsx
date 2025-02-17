import { Text } from '@/ui/Text';
import { Table as ChakraTable, Flex, Icon } from '@chakra-ui/react';
import { ArrowsClockwise } from '@phosphor-icons/react';
import { useMemo } from 'react';

import { CellRenderer, ColumnDefinition, Table } from '../Table';
import { TableContainer } from '../TableContainer';

enum ActivePoolsColumns {
  Provider = 'provider',
  PoxAddress = 'poxAddress',
  Contract = 'contract',
  RewardsIn = 'rewardsIn',
  StackersDelegating = 'stackersDelegating',
  AmountStacked = 'amountStacked',
  Rewards = 'rewards',
}

interface ActivePoolsData {
  [ActivePoolsColumns.Provider]: string;
  [ActivePoolsColumns.PoxAddress]: string;
  [ActivePoolsColumns.Contract]: string;
  [ActivePoolsColumns.RewardsIn]: string;
  [ActivePoolsColumns.StackersDelegating]: number;
  [ActivePoolsColumns.AmountStacked]: number;
  [ActivePoolsColumns.Rewards]: number;
}

const defaultCellRenderer: CellRenderer<ActivePoolsData, string | number> = (
  value: string | number | undefined
) => {
  return (
    <Text whiteSpace="nowrap" overflow="hidden" textOverflow="ellipsis" fontSize="sm">
      {String(value)}
    </Text>
  );
};

export function ActivePoolsTable() {
  const rowData: ActivePoolsData[] = useMemo(() => {
    const data: ActivePoolsData[] = Array.from({ length: 10 }, (_, index) => ({
      [ActivePoolsColumns.Provider]: 'Xverse' + index,
      [ActivePoolsColumns.PoxAddress]: 'bc1q9hquna0...h5edvpgxfjp6d5g',
      [ActivePoolsColumns.Contract]: 'xverse-pool-btc-v-1-2',
      [ActivePoolsColumns.RewardsIn]: '10,426',
      [ActivePoolsColumns.StackersDelegating]: 118432860,
      [ActivePoolsColumns.AmountStacked]: 12300000,
      [ActivePoolsColumns.Rewards]: 2325,
    }));
    return data;
  }, []);

  const columnDefinitions: ColumnDefinition<ActivePoolsData, any>[] = useMemo(
    () => [
      {
        id: ActivePoolsColumns.Provider,
        header: 'Provider',
        onSort: (a, b) => a.provider.localeCompare(b.provider),
        accessor: row => row[ActivePoolsColumns.Provider],
        cellRenderer: defaultCellRenderer,
      } as ColumnDefinition<ActivePoolsData, string>,
      {
        id: ActivePoolsColumns.PoxAddress,
        header: 'PoX Address',
        accessor: row => row[ActivePoolsColumns.PoxAddress],
        cellRenderer: defaultCellRenderer,
      } as ColumnDefinition<ActivePoolsData, string>,
      {
        id: ActivePoolsColumns.Contract,
        header: 'Contract',
        accessor: row => row[ActivePoolsColumns.Contract],
        cellRenderer: defaultCellRenderer,
      } as ColumnDefinition<ActivePoolsData, string>,
      {
        id: ActivePoolsColumns.RewardsIn,
        header: 'Rewards in',
        accessor: row => row[ActivePoolsColumns.RewardsIn],
        cellRenderer: defaultCellRenderer,
      } as ColumnDefinition<ActivePoolsData, string>,
      {
        id: ActivePoolsColumns.StackersDelegating,
        header: 'Stackers delegating',
        accessor: row => row[ActivePoolsColumns.StackersDelegating],
        cellRenderer: defaultCellRenderer,
      } as ColumnDefinition<ActivePoolsData, number>,
      {
        id: ActivePoolsColumns.AmountStacked,
        header: 'Amount stacked',
        accessor: row => row[ActivePoolsColumns.AmountStacked],
        cellRenderer: defaultCellRenderer,
      } as ColumnDefinition<ActivePoolsData, number>,
      {
        id: ActivePoolsColumns.Rewards,
        header: 'Rewards',
        accessor: row => row[ActivePoolsColumns.Rewards],
        cellRenderer: defaultCellRenderer,
      } as ColumnDefinition<ActivePoolsData, number>,
    ],
    []
  );

  return (
    <Table<ActivePoolsData>
      rowData={rowData}
      columnDefinitions={columnDefinitions}
      hasScrollIndicator
      hasFixedFirstColumn
      tableContainerWrapper={table => (
        <TableContainer title={'Active Pools'}>{table}</TableContainer>
      )}
    />
  );
}
