import { Flex } from '@chakra-ui/react';
import { ColumnDef } from '@tanstack/react-table';

export enum SimpleTableColumns {
  Name = 'name',
  Age = 'age',
  City = 'city',
  Date = 'date',
  Status = 'status',
  StxBalance = 'stxBalance',
}

export const simpleTableRowData: SimpleTableData[] = [
  {
    name: 'John Doe',
    age: 28,
    city: 'New York',
    date: new Date('2024-03-15'),
    status: 'Active',
    stxBalance: 1500.5,
  },
  {
    name: 'Jane Smith',
    age: 32,
    city: 'London',
    date: new Date('2023-12-01'),
    status: 'Pending',
    stxBalance: 2750.75,
  },
  {
    name: 'Bob Johnson',
    age: 45,
    city: 'Paris',
    date: new Date('2024-01-15'),
    status: 'Inactive',
    stxBalance: 999.99,
  },
  {
    name: 'alice cooper',
    age: 74,
    city: 'Detroit',
    date: new Date('2024-03-14'),
    status: 'Active',
    stxBalance: 1500.5,
  },
  {
    name: 'Zack Brown',
    age: 19,
    city: 'Chicago',
    date: new Date('2023-06-30'),
    status: 'Active',
    stxBalance: 3000.0,
  },
  {
    name: 'Mary Jones',
    age: 32,
    city: 'Berlin',
    date: new Date(),
    status: 'Pending',
    stxBalance: 2500.25,
  },
  {
    name: 'Carlos Díaz',
    age: 52,
    city: 'Madrid',
    date: new Date('2024-02-29'),
    status: 'Active',
    stxBalance: 1750.49,
  },
  {
    name: 'Emma Watson',
    age: 99,
    city: 'London',
    date: new Date('2023-01-01'),
    status: 'Inactive',
    stxBalance: 0.0,
  },
  {
    name: 'Bob Anderson',
    age: 45,
    city: 'Sydney',
    date: new Date('2023-12-31'),
    status: 'Active',
    stxBalance: 999.99,
  },
  {
    name: '李 Wei',
    age: 36,
    city: 'Shanghai',
    date: new Date('2024-03-15T14:30:00'),
    status: 'Pending',
    stxBalance: 1234.56,
  },
];

export interface SimpleTableData {
  [SimpleTableColumns.Name]: string;
  [SimpleTableColumns.Age]: number;
  [SimpleTableColumns.City]: string;
  [SimpleTableColumns.Date]: Date;
  [SimpleTableColumns.Status]: string;
  [SimpleTableColumns.StxBalance]: number;
}

export function getSimpleTableColumnDefinitions(
  hasSorting?: boolean,
  pinFirstColumn?: boolean
): ColumnDef<SimpleTableData>[] {
  const columnDefinitions: ColumnDef<SimpleTableData>[] = [
    {
      id: SimpleTableColumns.Name,
      header: 'Name',
      accessorKey: SimpleTableColumns.Name,
      cell: ({ getValue }) => (
        <Flex w="fit-content">
          <strong>{getValue() as string}</strong>
        </Flex>
      ),
      enableSorting: hasSorting,
      enablePinning: pinFirstColumn,
      meta: {
        isPinned: pinFirstColumn ? 'left' : false,
      },
    },
    {
      id: SimpleTableColumns.Age,
      header: 'Age',
      accessorKey: SimpleTableColumns.Age,
      meta: {
        tooltip: 'Age in years',
      },
      enableSorting: hasSorting,
      cell: ({ getValue }) => `${getValue()} years`,
    },
    {
      id: SimpleTableColumns.City,
      header: 'City',
      accessorKey: SimpleTableColumns.City,
      cell: ({ getValue }) => <strong>{getValue() as string}</strong>,
      enableSorting: hasSorting,
    },
    {
      id: SimpleTableColumns.Date,
      header: 'Date',
      accessorKey: SimpleTableColumns.Date,
      cell: ({ getValue }) => (getValue() as Date).toLocaleDateString(),
      enableSorting: hasSorting,
    },
    {
      id: SimpleTableColumns.Status,
      header: 'Status',
      accessorKey: SimpleTableColumns.Status,
      cell: ({ getValue }) => getValue() as string,
      enableSorting: hasSorting,
    },
    {
      id: SimpleTableColumns.StxBalance,
      header: 'Stx Balance',
      accessorKey: SimpleTableColumns.StxBalance,
      cell: ({ getValue }) => (getValue() as number).toFixed(2),
      enableSorting: hasSorting,
    },
  ];
  return columnDefinitions;
}
