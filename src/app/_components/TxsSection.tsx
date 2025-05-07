'use client';

import { DefaultTableColumnHeader } from '@/common/components/table/TableComponents';
import {
  AddressLinkCellRenderer,
  TimeStampCellRenderer,
  TransactionTitleCellRenderer,
  TxLinkCellRenderer,
  TxTypeCellRenderer,
} from '@/common/components/table/table-examples/TxTableCellRenderers';
import {
  TxTableAddressColumnData,
  TxTableData,
  TxTableTransactionColumnData,
  TxsTable,
} from '@/common/components/table/table-examples/TxsTable';
import { TxTableColumns } from '@/common/components/table/table-examples/types';
import { useGlobalContext } from '@/common/context/useGlobalContext';
import { buildUrl } from '@/common/utils/buildUrl';
import { formatTimestamp, formatTimestampToRelativeTime } from '@/common/utils/time-utils';
import { truncateHex } from '@/common/utils/utils';
import { ButtonLink } from '@/ui/ButtonLink';
import { Text } from '@/ui/Text';
import { Flex, Stack } from '@chakra-ui/react';
import { ColumnDef, Header } from '@tanstack/react-table';

import { TXS_LIST_SIZE } from '../consts';

export const columnDefinitions: ColumnDef<TxTableData>[] = [
  {
    id: TxTableColumns.Transaction,
    header: 'Transaction',
    accessorKey: TxTableColumns.Transaction,
    cell: info => TransactionTitleCellRenderer(info.getValue() as TxTableTransactionColumnData),
    enableSorting: false,
  },
  {
    id: TxTableColumns.TxId,
    header: 'ID',
    accessorKey: TxTableColumns.TxId,
    cell: info => TxLinkCellRenderer(truncateHex(info.getValue() as string, 4, 5, false)),
    enableSorting: false,
  },
  {
    id: TxTableColumns.TxType,
    header: 'Type',
    accessorKey: TxTableColumns.TxType,
    cell: info => <TxTypeCellRenderer txType={info.getValue() as string} />,
    enableSorting: false,
  },
  {
    id: TxTableColumns.From,
    header: 'From',
    accessorKey: TxTableColumns.From,
    cell: info => AddressLinkCellRenderer(info.getValue() as TxTableAddressColumnData),
    enableSorting: false,
  },
  {
    id: TxTableColumns.To,
    header: 'To',
    accessorKey: TxTableColumns.To,
    cell: info => AddressLinkCellRenderer(info.getValue() as TxTableAddressColumnData),
    enableSorting: false,
  },
  {
    id: TxTableColumns.BlockTime,
    header: ({ header }: { header: Header<TxTableData, unknown> }) => (
      <Flex alignItems="center" justifyContent="flex-end" w="full">
        <DefaultTableColumnHeader header={header}>Timestamp</DefaultTableColumnHeader>
      </Flex>
    ),
    accessorKey: TxTableColumns.BlockTime,
    cell: info => (
      <Flex alignItems="center" justifyContent="flex-end" w="full">
        {TimeStampCellRenderer(
          formatTimestampToRelativeTime(info.getValue() as number),
          formatTimestamp(info.getValue() as number, 'HH:mm:ss')
        )}
      </Flex>
    ),
    enableSorting: false,
    size: 150,
  },
];

export const TxsSection = ({ initialTxTableData }: { initialTxTableData: any }) => {
  const network = useGlobalContext().activeNetwork;

  return (
    <Stack gap={6} flex={1} maxWidth={['100%', '100%', '100%', '100%', '50%']}>
      <Flex justifyContent={'space-between'} alignItems={'center'}>
        <Text whiteSpace={'nowrap'} textStyle="heading-md" color="textPrimary">
          Latest transactions
        </Text>
        <ButtonLink
          href={buildUrl('/transactions', network)}
          buttonLinkSize="big"
          display={{ base: 'none', sm: 'inline' }}
          mr={2}
        >
          View all transactions
        </ButtonLink>
      </Flex>
      <TxsTable
        filters={{}}
        initialData={initialTxTableData}
        disablePagination
        pageSize={TXS_LIST_SIZE}
        columnDefinitions={columnDefinitions}
      />
      <ButtonLink
        href={buildUrl('/transactions', network)}
        buttonLinkSize="big"
        display={{ base: 'inline', sm: 'none' }}
      >
        View all transactions
      </ButtonLink>
    </Stack>
  );
};
