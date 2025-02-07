import { TablePaginationControls } from '@/common/components/table/TablePaginationControls';
import { Stack } from '@chakra-ui/react';
import type { Meta, StoryObj } from '@storybook/react';
import { PaginationState } from '@tanstack/react-table';
import { useState } from 'react';

const meta: Meta<typeof TablePaginationControls> = {
  title: 'Components/Table/TablePaginationControls',
  component: TablePaginationControls,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    pageIndex: {
      control: 'number',
    },
    pageSize: {
      control: 'number',
    },
  },
  decorators: [
    (Story, { args }) => {
      return (
        <Stack
          w={'100vw'}
          h={'100%'}
          className="not-story-book-root"
          alignItems="center"
          justifyContent="center"
          bg="surfaceTertiary"
        >
          <Story />
        </Stack>
      );
    },
  ],
};

export default meta;
type Story = StoryObj<typeof TablePaginationControls>;

// Interactive example with state management
const InteractivePagination = (args: any) => {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: args.pageIndex || 0,
    pageSize: args.pageSize || 10,
  });

  const handlePageChange = (newPagination: PaginationState) => {
    setPagination(newPagination);
    args.onPageChange?.(newPagination);
  };

  return (
    <TablePaginationControls
      {...args}
      pageIndex={pagination.pageIndex}
      pageSize={pagination.pageSize}
      onPageChange={handlePageChange}
    />
  );
};

export const Short: Story = {
  render: args => <InteractivePagination {...args} />,
  args: {
    pageIndex: 0,
    pageSize: 10,
    totalRows: 50,
    onPageChange: (pagination: PaginationState) => console.log('Page changed:', pagination),
  },
};

export const Long: Story = {
  render: args => <InteractivePagination {...args} />,
  args: {
    pageIndex: 0,
    pageSize: 10,
    totalRows: 990,
    onPageChange: (pagination: PaginationState) => console.log('Page changed:', pagination),
  },
};

export const Infinite: Story = {
  render: args => <InteractivePagination {...args} />,
  args: {
    pageIndex: 0,
    pageSize: 10,
    totalRows: 9900,
    onPageChange: (pagination: PaginationState) => console.log('Page changed:', pagination),
  },
};
