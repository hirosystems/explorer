import { Table, TableProps } from '@/common/components/table/Table';
import { TableContainer } from '@/common/components/table/TableContainer';
import { TableSkeleton } from '@/common/components/table/TableSkeleton';
import { UpdateTableBannerRow } from '@/common/components/table/table-examples/TxsTable';
import { Box, Stack } from '@chakra-ui/react';
import { MINIMAL_VIEWPORTS } from '@storybook/addon-viewport';
import type { Meta, StoryObj } from '@storybook/react';
import { Suspense } from 'react';

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
  showSkeleton?: boolean;
  hasSuspenseWrapper?: boolean;
  hasError?: boolean;
  isLoading?: boolean;
  pinFirstColumn?: boolean;
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
    hasScrollIndicator: {
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
    hasScrollIndicator: true,
  },
  render: args => {
    if (args.showSkeleton) {
      return (
        <TableContainer>
          <TableSkeleton numRows={10} numColumns={5} />
        </TableContainer>
      );
    }

    return (
      <Table
        tableContainerWrapper={
          args.hasTableContainerWrapper
            ? table => <TableContainer>{table}</TableContainer>
            : undefined
        }
        columns={getSimpleTableColumnDefinitions(
          args.hasSorting ?? false,
          args.pinFirstColumn ?? false
        )}
        data={args.isEmpty ? [] : args.showSkeleton ? [] : simpleTableRowData}
        hasScrollIndicator={args.hasScrollIndicator}
        isLoading={args.isLoading}
      />
    );
  },
};

export const TxTable: Story = {
  render: args => {
    if (args.showSkeleton) {
      return (
        <TableContainer>
          <TableSkeleton numRows={10} numColumns={5} />
        </TableContainer>
      );
    }

    return (
      <Table
        tableContainerWrapper={
          args.hasTableContainerWrapper
            ? table => <TableContainer>{table}</TableContainer>
            : undefined
        }
        columns={getStorybookTxTableTanstackColumns(args.hasSorting, args.pinFirstColumn)}
        data={args.isEmpty ? [] : storybookTxTableRowData}
        bannerRow={args.bannerRow ? <UpdateTableBannerRow /> : undefined}
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
        hasScrollIndicator={args.hasScrollIndicator}
        error={args.hasError ? (args.error ? args.error : 'An error occurred') : undefined}
      />
    );
  },
};
