import { TableContainer } from '@/common/components/table/TableContainer';
import { TableSkeleton } from '@/common/components/table/TableSkeleton';
import {
  UpdateTableBannerRow,
  columnDefinitions as txTableColumnDefinitions,
} from '@/common/components/table/table-examples/TxsTable';
import { Text } from '@/ui/Text';
import { Box, Stack } from '@chakra-ui/react';
import { MINIMAL_VIEWPORTS } from '@storybook/addon-viewport';
import type { Meta, StoryObj } from '@storybook/react';
import { Suspense, useEffect, useRef, useState } from 'react';

import { Table, TableProps } from '../common/components/table/Table';
import { simpleTableRowData } from './table-utils/simple-table-data';
import { getSimpleTableColumnDefinitions } from './table-utils/simple-table-utils';
import { txTableRowData } from './table-utils/tx-table-data';

interface TableStoryArgs extends TableProps<unknown> {
  isEmpty?: boolean;
  hasSorting?: boolean;
  hasTableContainerWrapper?: boolean;
  showSkeleton?: boolean;
  hasSuspenseWrapper?: boolean;
  hasError?: boolean;
  containerWidth?: string;
  containerHeight?: string;
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
    containerWidth: '300px',
    containerHeight: '500px',
  },
  argTypes: {
    hasScrollIndicator: {
      control: 'boolean',
    },
    hasFixedFirstColumn: {
      control: 'boolean',
    },
    bannerRow: {
      control: 'boolean',
      description: 'Toggle banner row visibility',
    },
    // Fake props to add controls to the table
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
    containerWidth: {
      control: 'text',
      description: 'Width of the container (e.g., "800px", "100%")',
      placeholder: 'Enter width (e.g., 800px)',
    },
    containerHeight: {
      control: 'text',
      description: 'Height of the container (e.g., "auto", "500px")',
      placeholder: 'Enter height (e.g., 500px)',
    },
  },
  // decorators: [
  //   (Story, { args }) => {
  //     const [size, setSize] = useState({
  //       width: args.containerWidth,
  //       height: args.containerHeight,
  //     });
  //     const containerRef = useRef<HTMLDivElement>(null);

  //     useEffect(() => {
  //       const observer = new ResizeObserver(entries => {
  //         const entry = entries[0];
  //         if (entry) {
  //           setSize({
  //             width: Math.round(parseFloat(entry.contentRect.width.toString())).toString(),
  //             height: Math.round(parseFloat(entry.contentRect.height.toString())).toString(),
  //           });
  //         }
  //       });

  //       if (containerRef.current) {
  //         observer.observe(containerRef.current);
  //       }

  //       return () => observer.disconnect();
  //     }, []);

  //     return (
  //       <Box
  //         ref={containerRef}
  //         w={size.width}
  //         h={size.height}
  //         bg="gray.50"
  //         overflow="hidden"
  //         border="1px solid"
  //         borderColor="redesignBorderPrimary"
  //         resize="both" // Makes this container resizable
  //         // style={{ maxWidth: '100%' }} // Makes this container resizable
  //       >
  //         <Stack p={10} gap={2}>
  //           <Text fontSize="sm" color="gray.600">
  //             Size: {size.width}px × {size.height}px
  //           </Text>
  //           <Story />
  //         </Stack>
  //       </Box>
  //     );
  //   },
  // ],
  decorators: [
    (Story, { args }) => {
      return (
        <Box
          w={'full'}
          h={'full'}
          bg="gray.50"
          overflow="hidden"
          border="1px solid"
          borderColor="redesignBorderPrimary"
          // resize="both" // Makes this container resizable
          // style={{ maxWidth: '100%' }} // Makes this container resizable
          className="not-story-book-root"
        >
          <Stack p={10} gap={2}>
            <Story w="full" />
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
    return (
      <Table
        tableContainerWrapper={
          args.hasTableContainerWrapper
            ? table => <TableContainer>{table}</TableContainer>
            : undefined
        }
        columnDefinitions={getSimpleTableColumnDefinitions(args.hasSorting)}
        rowData={args.isEmpty ? [] : args.showSkeleton ? [] : simpleTableRowData}
        hasScrollIndicator={args.hasScrollIndicator}
        hasFixedFirstColumn={args.hasFixedFirstColumn}
      />
    );
  },
};

export const TxTable: Story = {
  render: args => {
    if (args.showSkeleton) {
      throw new Promise((_, reject) => setTimeout(() => reject(), 2000));
      // or more simply:
      // throw new Promise(() => {});
    }
    return (
      <Table
        tableContainerWrapper={
          args.hasTableContainerWrapper
            ? table => <TableContainer title={'Transactions'}>{table}</TableContainer>
            : undefined
        }
        columnDefinitions={txTableColumnDefinitions}
        rowData={args.isEmpty ? [] : txTableRowData}
        bannerRow={args.bannerRow ? <UpdateTableBannerRow /> : undefined}
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
        hasFixedFirstColumn={args.hasFixedFirstColumn}
      />
    );
  },
};
