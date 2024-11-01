import type { Meta, StoryObj } from '@storybook/react';

import { ColumnDefinition, Table } from '../common/components/table/Table';
import { Box } from '../ui/Box';

const meta: Meta<typeof Table> = {
  title: 'Components/Table',
  component: Table,
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof Table>;

// Sample data
const sampleData = [
  ['John Doe', 'john@example.com', 30, 'Active'],
  ['Jane Smith', 'jane@example.com', 25, 'Inactive'],
  ['Bob Johnson', 'bob@example.com', 35, 'Active'],
  ['Alice Brown', 'alice@example.com', 28, 'Active'],
];

const columns: ColumnDefinition[] = [
  {
    id: 'name',
    header: 'Name',
    accessor: row => row,
    sortable: true,
  },
  {
    id: 'email',
    header: 'Email',
    accessor: row => row,
    sortable: true,
  },
  {
    id: 'age',
    header: 'Age',
    accessor: row => row,
    sortable: true,
  },
  {
    id: 'status',
    header: 'Status',
    accessor: row => row,
    cellRenderer: value => (
      <Box
        px={2}
        py={1}
        borderRadius="full"
        bg={value === 'Active' ? 'green.100' : 'red.100'}
        color={value === 'Active' ? 'green.700' : 'red.700'}
        fontSize="sm"
        width="fit-content"
      >
        {value}
      </Box>
    ),
  },
];

export const Default: Story = {
  args: {
    title: 'Users Table',
    rowData: sampleData,
    columnDefinitions: columns,
  },
};

export const WithSorting: Story = {
  args: {
    ...Default.args,
    sortColumn: 'name',
    sortDirection: 'asc',
    onSort: (columnId, direction) => {
      console.log(`Sorting ${columnId} in ${direction} direction`);
    },
  },
};

export const WithTopRight: Story = {
  args: {
    ...Default.args,
    topRight: (
      <Box p={2} bg="blue.100" borderRadius="md">
        Custom Top Right Content
      </Box>
    ),
  },
};

export const EmptyTable: Story = {
  args: {
    ...Default.args,
    rowData: [],
  },
};

export const LongContent: Story = {
  args: {
    ...Default.args,
    rowData: Array(20).fill(sampleData[0]),
  },
};
