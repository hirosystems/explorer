import { Table, TableProps } from '@/common/components/table/Table';
import { TableContainer } from '@/common/components/table/TableContainer';
import { TableScrollIndicator } from '@/common/components/table/TableScrollIndicatorWrapper';
import { TableSkeleton } from '@/common/components/table/TableSkeleton';
import { UpdateTableBannerRow } from '@/common/components/table/table-examples/TxsTable';
import { Box, Stack } from '@chakra-ui/react';
import { MINIMAL_VIEWPORTS } from '@storybook/addon-viewport';
import type { Meta, StoryObj } from '@storybook/react';
import { PaginationState } from '@tanstack/react-table';
import { Suspense, useState } from 'react';

import {
  getSimpleTableColumnDefinitions,
  simpleTableRowData,
} from './table-utils/simple-table-utils';
import {
  getStorybookTxTableTanstackColumns,
  storybookTxTableRowData,
} from './table-utils/tx-table-data';

interface TableStoryArgs extends TableProps<unknown> {
  isEmpty?: boolean;
  hasSorting?: boolean;
  hasTableContainerWrapper?: boolean;
  hasTableScrollIndicatorWrapper?: boolean;
  showSkeleton?: boolean;
  hasSuspenseWrapper?: boolean;
  hasError?: boolean;
  isLoading?: boolean;
  pinFirstColumn?: boolean;
  hasPagination?: boolean;
  pageSize?: number;
}

const meta: Meta<TableStoryArgs> = {
  title: 'Components/Table',
  component: Table,
  parameters: {
    layout: 'centered',
    viewport: {
      viewports: {
        ...MINIMAL_VIEWPORTS,
        customSmall: {
          name: 'Small Mobile',
          styles: { width: '320px', height: '568px' },
        },
        customTablet: {
          name: 'Tablet',
          styles: { width: '768px', height: '1024px' },
        },
        customDesktop: {
          name: 'Desktop',
          styles: { width: '1280px', height: '800px' },
        },
      },
    },
  },
  args: {
    hasTableContainerWrapper: true,
  },
  argTypes: {
    hasTableScrollIndicatorWrapper: {
      control: 'boolean',
    },
    pinFirstColumn: {
      control: 'boolean',
    },
    bannerRow: {
      control: 'boolean',
      description: 'Toggle banner row visibility',
    },
    hasTableContainerWrapper: {
      control: 'boolean',
      description: 'Toggle table container wrapper visibility',
    },
    hasSorting: {
      control: 'boolean',
      description: 'Add sorting to the table',
    },
    isEmpty: {
      control: 'boolean',
      description: 'Toggle empty table visibility',
    },
    isLoading: {
      control: 'boolean',
      description: 'Toggle loading state',
    },
    showSkeleton: {
      control: 'boolean',
      description: 'Toggle skeleton visibility',
    },
    hasSuspenseWrapper: {
      control: 'boolean',
      description: 'Toggle suspense wrapper visibility',
    },
    hasError: {
      control: 'boolean',
      description: 'Toggle error visibility',
    },
    hasPagination: {
      control: 'boolean',
      description: 'Toggle pagination visibility',
    },
    pageSize: {
      control: 'number',
      description: 'Set the page size',
    },
  },
  decorators: [
    (Story, { args }) => {
      return (
        <Box
          w={'100vw'}
          h={'100%'}
          bg="surfaceFourth"
          border="1px solid"
          borderColor="redesignBorderPrimary"
          className="not-story-book-root"
        >
          <Stack p={10} w="full" h="full">
            <Story w="full" h="full" overflowY="auto" />
          </Stack>
        </Box>
      );
    },
  ],
};

export default meta;
type Story = StoryObj<TableStoryArgs>;

export const SimpleTable: Story = {
  args: {
    hasSorting: true,
  },
  render: args => {
    if (args.showSkeleton) {
      return (
        <TableContainer minHeight="500px">
          <TableSkeleton numRows={10} numColumns={5} />
        </TableContainer>
      );
    }

    const SimpleTableComponent = () => {
      const [pageIndex, setPageIndex] = useState(0);
      const [pageSize, setPageSize] = useState(args.pageSize ?? 3);
      const totalRows = simpleTableRowData.length;

      return (
        <Table
          tableContainerWrapper={
            args.hasTableContainerWrapper
              ? table => <TableContainer minHeight="500px">{table}</TableContainer>
              : undefined
          }
          columns={getSimpleTableColumnDefinitions(
            args.hasSorting ?? false,
            args.pinFirstColumn ?? false
          )}
          data={args.isEmpty ? [] : args.showSkeleton ? [] : simpleTableRowData}
          scrollIndicatorWrapper={
            args.hasTableScrollIndicatorWrapper
              ? table => <TableScrollIndicator>{table}</TableScrollIndicator>
              : undefined
          }
          isLoading={args.isLoading}
          pagination={
            args.hasPagination
              ? {
                  manualPagination: false,
                  pageIndex,
                  pageSize,
                  totalRows,
                  onPageChange: (page: PaginationState) => {
                    setPageIndex(page.pageIndex);
                    setPageSize(page.pageSize);
                  },
                  onPageSizeChange: (pageSize: PaginationState) => {
                    setPageSize(pageSize.pageSize);
                  },
                }
              : undefined
          }
        />
      );
    };

    return <SimpleTableComponent />;
  },
};

export const TxTable: Story = {
  render: args => {
    if (args.showSkeleton) {
      return (
        <TableContainer minHeight="500px">
          <TableSkeleton numRows={10} numColumns={5} />
        </TableContainer>
      );
    }

    const TxTableComponent = () => {
      const [pageIndex, setPageIndex] = useState(0);
      const [pageSize, setPageSize] = useState(args.pageSize ?? 5);
      const totalRows = storybookTxTableRowData.length;

      return (
        <>
          <Table
            tableContainerWrapper={
              args.hasTableContainerWrapper
                ? table => <TableContainer minHeight="500px">{table}</TableContainer>
                : undefined
            }
            columns={getStorybookTxTableTanstackColumns(args.hasSorting, args.pinFirstColumn)}
            data={args.isEmpty ? [] : storybookTxTableRowData}
            bannerRow={args.bannerRow ? <UpdateTableBannerRow onClick={() => {}} /> : undefined}
            isLoading={args.isLoading}
            suspenseWrapper={
              args.hasSuspenseWrapper
                ? table => (
                    <Suspense fallback={<TableSkeleton numRows={10} numColumns={5} />}>
                      {table}
                    </Suspense>
                  )
                : undefined
            }
            scrollIndicatorWrapper={
              args.hasTableScrollIndicatorWrapper
                ? table => <TableScrollIndicator>{table}</TableScrollIndicator>
                : undefined
            }
            error={args.hasError ? (args.error ? args.error : 'An error occurred') : undefined}
            pagination={
              args.hasPagination
                ? {
                    manualPagination: false,
                    pageIndex,
                    pageSize,
                    totalRows,
                    onPageChange: (page: PaginationState) => {
                      setPageIndex(page.pageIndex);
                      setPageSize(page.pageSize);
                    },
                    onPageSizeChange: (pageSize: PaginationState) => {
                      setPageSize(pageSize.pageSize);
                    },
                  }
                : undefined
            }
          />
        </>
      );
    };

    return <TxTableComponent />;
  },
};
