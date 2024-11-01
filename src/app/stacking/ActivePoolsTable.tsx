import { useCallback, useMemo, useState } from 'react';

import { ColumnDefinition, Table } from '../../common/components/table/Table';

type ActivePoolsData = [string, string, string, string, string, string, string];

export function ActivePoolsTable() {
  const rowData: ActivePoolsData[] = useMemo(
    () =>
      Array.from({ length: 10 }, (_, index) => index + 1).map(row => [
        'Xverse',
        'bc1q9hquna0...h5edvpgxfjp6d5g',
        'xverse-pool-btc-v-1-2',
        'BTC',
        '10,426',
        '118,432,860 STX ($12.3M)',
        '2,325 BTC',
      ]),
    []
  );
  const columnDefinitions: ColumnDefinition[] = useMemo(
    () => [
      { id: 'Provider', header: 'Provider', accessor: (val: any) => val, sortable: true },
      { id: 'PoX Address', header: 'PoX Address', accessor: (val: any) => val, sortable: false },
      { id: 'Contract', header: 'Contract', accessor: (val: any) => val, sortable: false },
      { id: 'Rewards in', header: 'Rewards in', accessor: (val: any) => val, sortable: false },
      {
        id: 'Stackers delegating',
        header: 'Stackers delegating',
        accessor: (val: any) => val,
        sortable: true,
      },
      {
        id: 'Amount stacked',
        header: 'Amount stacked',
        accessor: (val: any) => val,
        sortable: true,
      },
      { id: 'Rewards', header: 'Rewards', accessor: (val: any) => val, sortable: true },
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
    <Table
      title="Active Pools"
      topRight={null}
      rowData={rowData}
      columnDefinitions={columnDefinitions}
      onSort={onSort}
      sortColumn={sortColumn}
      sortDirection={sortDirection}
    />
  );
}
