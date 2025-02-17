import { ColumnDefinition } from '@/common/components/table/Table';

export enum SimpleTableColumns {
  Name = 'name',
  Age = 'age',
  City = 'city',
  Date = 'date',
  Status = 'status',
  StxBalance = 'stxBalance',
}

export interface SimpleTableData {
  [SimpleTableColumns.Name]: string;
  [SimpleTableColumns.Age]: number;
  [SimpleTableColumns.City]: string;
  [SimpleTableColumns.Date]: Date;
  [SimpleTableColumns.Status]: string;
  [SimpleTableColumns.StxBalance]: number;
}

export function getSimpleTableColumnDefinitions(
  hasSorting?: boolean
): ColumnDefinition<SimpleTableData>[] {
  const columnDefinitions: ColumnDefinition<any>[] = [
    {
      id: SimpleTableColumns.Name,
      header: 'Name',
      accessor: (row: SimpleTableData) => row[SimpleTableColumns.Name],
      cellRenderer: (value: string) => <strong>{value}</strong>,
      onSort: hasSorting
        ? (a: SimpleTableData, b: SimpleTableData) =>
            a[SimpleTableColumns.Name].localeCompare(b[SimpleTableColumns.Name])
        : undefined,
    } as ColumnDefinition<SimpleTableData, string>,
    {
      id: SimpleTableColumns.Age,
      header: 'Age',
      accessor: (row: SimpleTableData) => row[SimpleTableColumns.Age],
      tooltip: 'Age in years',
      cellRenderer: (value: number) => `${value} years`,
      onSort: hasSorting
        ? (a: SimpleTableData, b: SimpleTableData) =>
            a[SimpleTableColumns.Age] - b[SimpleTableColumns.Age]
        : undefined,
    } as ColumnDefinition<SimpleTableData, number>,
    {
      id: SimpleTableColumns.City,
      header: 'City',
      accessor: (row: SimpleTableData) => row[SimpleTableColumns.City],
      cellRenderer: (value: string) => <strong>{value}</strong>,
      onSort: hasSorting
        ? (a: SimpleTableData, b: SimpleTableData) =>
            a[SimpleTableColumns.City].localeCompare(b[SimpleTableColumns.City])
        : undefined,
    } as ColumnDefinition<SimpleTableData, string>,
    {
      id: SimpleTableColumns.Date,
      header: 'Date',
      accessor: (row: SimpleTableData) => row[SimpleTableColumns.Date],
      cellRenderer: (value: Date) => value.toLocaleDateString(),
      onSort: hasSorting
        ? (a: SimpleTableData, b: SimpleTableData) =>
            a[SimpleTableColumns.Date].getTime() - b[SimpleTableColumns.Date].getTime()
        : undefined,
    } as ColumnDefinition<SimpleTableData, Date>,
    {
      id: SimpleTableColumns.Status,
      header: 'Status',
      accessor: (row: SimpleTableData) => row[SimpleTableColumns.Status],
      cellRenderer: (value: string) => <span className={value.toLowerCase()}>{value}</span>,
      onSort: hasSorting
        ? (a: SimpleTableData, b: SimpleTableData) =>
            a[SimpleTableColumns.Status].localeCompare(b[SimpleTableColumns.Status])
        : undefined,
    } as ColumnDefinition<SimpleTableData, string>,
    {
      id: SimpleTableColumns.StxBalance,
      header: 'Stx Balance',
      accessor: (row: SimpleTableData) => row[SimpleTableColumns.StxBalance],
      cellRenderer: (value: number) => value.toFixed(2),
      onSort: hasSorting
        ? (a: SimpleTableData, b: SimpleTableData) =>
            a[SimpleTableColumns.StxBalance] - b[SimpleTableColumns.StxBalance]
        : undefined,
    } as ColumnDefinition<SimpleTableData, number>,
  ];
  return columnDefinitions;
}
