import { useCallback, useMemo, useState } from 'react';

import CustomTable, { ColumnDefinition } from './CustomTable';

type PreviousCyclesData = [number, string, string, number, number, number, string, string];

export function PreviousCyclesTable() {
  const data: PreviousCyclesData[] = useMemo(
    () =>
      Array.from({ length: 10 }, (_, index) => index + 1).map((row, i) => [
        i,
        'B 42,946 Stx 784,946', // TODO: perfect example to try cell renderer
        'B 42,946 Stx 784,946',
        '22',
        '245',
        '67',
        '118,432,860 STX ($12.3M)',
        '35.1 BTC',
        '7.5%',
        '100,000 STX',
      ]),
    []
  );
  const columns: ColumnDefinition[] = useMemo(
    () => [
      { id: 'Cycle', header: 'Cycle', accessor: (val: any) => val, sortable: true },
      { id: 'Started', header: 'Started', accessor: (val: any) => val, sortable: false },
      { id: 'Ended', header: 'Ended', accessor: (val: any) => val, sortable: false },
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
    <CustomTable
      title="Previous Cycles"
      topRight={null}
      data={data}
      columns={columns}
      onSort={onSort}
      sortColumn={sortColumn}
      sortDirection={sortDirection}
    />
  );
}
