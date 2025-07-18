'use client';

import { useSubscribeTxs } from '@/app/_components/BlockList/Sockets/useSubscribeTxs';
import { CompressedMempoolTxTableData } from '@/app/transactions/utils';
import { useInfiniteQueryResult } from '@/common/hooks/useInfiniteQueryResult';
import { GenericResponseType } from '@/common/hooks/useInfiniteQueryResult';
import { useMempoolTransactionsInfinite } from '@/common/queries/useMempoolTransactionsInfinite';
import { formatTimestamp, formatTimestampToRelativeTime } from '@/common/utils/time-utils';
import { getAmount, getToAddress } from '@/common/utils/transaction-utils';
import { microToStacksFormatted, validateStacksContractId } from '@/common/utils/utils';
import { Text } from '@/ui/Text';
import { Box, Table as ChakraTable, Flex, Icon } from '@chakra-ui/react';
import { ArrowRight, ArrowsClockwise } from '@phosphor-icons/react';
import { useQueryClient } from '@tanstack/react-query';
import { ColumnDef, Header, PaginationState } from '@tanstack/react-table';
import { type JSX, useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { MempoolTransaction, Transaction } from '@stacks/stacks-blockchain-api-types';

import { Table } from '../Table';
import { DefaultTableColumnHeader } from '../TableComponents';
import { TableContainer } from '../TableContainer';
import { TableScrollIndicator } from '../TableScrollIndicatorWrapper';
import { TxTableFilters } from '../tx-table/useTxTableFilters';
import {
  AddressLinkCellRenderer,
  FeeCellRenderer,
  IconCellRenderer,
  TimeStampCellRenderer,
  TransactionTitleCellRenderer,
  TxLinkCellRenderer,
  TxTypeCellRenderer,
} from './TxTableCellRenderers';
import { TxTableAddressColumnData, TxTableTransactionColumnData } from './TxsTable';
import { TxTableColumns } from './types';

export interface MempoolTableData {
  [TxTableColumns.Transaction]: TxTableTransactionColumnData;
  [TxTableColumns.TxId]: string;
  [TxTableColumns.TxType]: MempoolTransaction['tx_type'];
  [TxTableColumns.From]: TxTableAddressColumnData;
  [TxTableColumns.ArrowRight]: JSX.Element;
  [TxTableColumns.To]: TxTableAddressColumnData;
  [TxTableColumns.Fee]: string;
  [TxTableColumns.Amount]: number;
  [TxTableColumns.BlockTime]: number;
}

const defaultColumnDefinitions: ColumnDef<MempoolTableData>[] = [
  {
    id: TxTableColumns.Transaction,
    header: 'Transaction',
    accessorKey: TxTableColumns.Transaction,
    cell: info => TransactionTitleCellRenderer(info.getValue() as TxTableTransactionColumnData),
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
    id: TxTableColumns.TxId,
    header: 'ID',
    accessorKey: TxTableColumns.TxId,
    cell: info => TxLinkCellRenderer(info.getValue() as string),
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
    id: TxTableColumns.ArrowRight,
    header: '',
    accessorKey: TxTableColumns.ArrowRight,
    cell: info => IconCellRenderer(info.getValue() as JSX.Element),
    enableSorting: false,
    size: 45,
    minSize: 45,
    maxSize: 45,
  },
  {
    id: TxTableColumns.To,
    header: 'To',
    accessorKey: TxTableColumns.To,
    cell: info => AddressLinkCellRenderer(info.getValue() as TxTableAddressColumnData),
    enableSorting: false,
  },
  {
    id: TxTableColumns.Fee,
    header: ({ header }: { header: Header<MempoolTableData, unknown> }) => (
      <Flex alignItems="center" justifyContent="flex-end" w="full">
        <DefaultTableColumnHeader header={header}>Fee</DefaultTableColumnHeader>
      </Flex>
    ),
    accessorKey: TxTableColumns.Fee,
    cell: info => (
      <Flex alignItems="center" justifyContent="flex-end" w="full">
        {FeeCellRenderer(info.getValue() as string)}
      </Flex>
    ),
    enableSorting: true,
  },
  {
    id: TxTableColumns.BlockTime,
    header: ({ header }: { header: Header<MempoolTableData, unknown> }) => (
      <Flex alignItems="center" justifyContent="flex-end" w="full">
        <DefaultTableColumnHeader header={header}>Timestamp</DefaultTableColumnHeader>
      </Flex>
    ),
    accessorKey: TxTableColumns.BlockTime,
    cell: info => (
      <Flex alignItems="center" justifyContent="flex-end" w="full">
        {TimeStampCellRenderer(
          formatTimestampToRelativeTime(info.getValue() as number),
          formatTimestamp(info.getValue() as number, 'HH:mm:ss', true)
        )}
      </Flex>
    ),
    enableSorting: false,
    meta: {
      tooltip: 'Timestamps are shown in your local timezone',
    },
  },
];

const TX_TABLE_PAGE_SIZE = 20;

export const UpdateTableBannerRow = ({ onClick }: { onClick: () => void }) => {
  const numColumns = Object.keys(TxTableColumns).length;

  return (
    <ChakraTable.Row
      bg="transparent"
      css={{
        '& > td:first-of-type': {
          borderTopLeftRadius: 'redesign.md',
          borderBottomLeftRadius: 'redesign.md',
        },
        '& > td:last-of-type': {
          borderTopRightRadius: 'redesign.md',
          borderBottomRightRadius: 'redesign.md',
        },
      }}
      onClick={onClick}
      cursor="pointer"
      className="group"
    >
      <ChakraTable.Cell colSpan={numColumns} py={2} px={1}>
        <Flex
          alignItems="center"
          justifyContent={{ base: 'flex-start', md: 'center' }}
          gap={1.5}
          boxShadow="0px 4px 4px 0px rgba(252, 100, 50, 0.25), 0px 4px 4px 0px rgba(255, 85, 18, 0.25)"
          border="1px dashed var(--stacks-colors-accent-stacks-500)"
          borderRadius="redesign.lg"
          h={12}
          px={4}
        >
          <Box display="inline-flex">
            <Text fontSize="sm" fontWeight="medium" color="textSecondary">
              New transactions have come in.
            </Text>
            &nbsp;
            <Text
              fontSize="sm"
              fontWeight="medium"
              color="textSecondary"
              _groupHover={{ color: 'textPrimary' }}
            >
              Update list
            </Text>
          </Box>
          <Icon h={3.5} w={3.5} color="iconTertiary" _groupHover={{ color: 'iconSecondary' }}>
            <ArrowsClockwise />
          </Icon>
        </Flex>
      </ChakraTable.Cell>
    </ChakraTable.Row>
  );
};

export function MempoolTable({
  columnDefinitions,
  disablePagination = false,
  sort = 'age',
  order = 'desc',
  filters,
  initialData,
}: {
  columnDefinitions?: ColumnDef<MempoolTableData>[];
  disablePagination?: boolean;
  sort?: 'age' | 'size' | 'fee';
  order?: 'asc' | 'desc';
  filters?: Partial<TxTableFilters>;
  initialData?: GenericResponseType<CompressedMempoolTxTableData>;
}) {
  const queryClient = useQueryClient();
  const isCacheSetWithInitialData = useRef(false);

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: TX_TABLE_PAGE_SIZE,
  });

  const { fromAddress, toAddress } = filters || {};

  if (isCacheSetWithInitialData.current === false && initialData) {
    const queryKey = ['mempoolTransactionsInfinite', sort, order, fromAddress, toAddress];
    queryClient.setQueryData(queryKey, {
      pageParams: [0],
      pages: [initialData],
    });
    isCacheSetWithInitialData.current = true;
  }

  const response = useMempoolTransactionsInfinite(sort, order, {
    fromAddress,
    toAddress,
  });
  const txs = useInfiniteQueryResult<MempoolTransaction>(
    response,
    disablePagination ? undefined : TX_TABLE_PAGE_SIZE
  );

  const handlePageChange = useCallback((page: PaginationState) => {
    setPagination(prev => ({
      ...prev,
      pageIndex: page.pageIndex,
    }));
  }, []);

  const isTableFiltered =
    (filters?.fromAddress && filters.fromAddress !== '') ||
    (filters?.toAddress && filters.toAddress !== '');

  const [isSubscriptionActive, setIsSubscriptionActive] = useState(false);
  const [newTxsAvailable, setNewTxsAvailable] = useState(false);

  useSubscribeTxs(isSubscriptionActive, tx => {
    // Waiting 5 seconds to let the API catch up to the websocket
    setTimeout(() => {
      setNewTxsAvailable(true);
    }, 5000);
    setIsSubscriptionActive(false);
  });

  useEffect(() => {
    if (!newTxsAvailable) {
      setIsSubscriptionActive(true);
    }
  }, [newTxsAvailable]);

  const rowData: MempoolTableData[] = useMemo(() => {
    return txs.map(tx => {
      const to = getToAddress(tx);
      const amount = getAmount(tx);

      return {
        [TxTableColumns.Transaction]: {
          amount: microToStacksFormatted(amount),
          functionName:
            tx.tx_type === 'contract_call' ? tx.contract_call?.function_name : undefined,
          contractName: tx.tx_type === 'contract_call' ? tx.contract_call?.contract_id : undefined,
          txType: tx.tx_type,
          smartContract: {
            contractId:
              tx.tx_type === 'smart_contract' ? tx.smart_contract?.contract_id : undefined,
          },
          txId: tx.tx_id,
          blockHeight: 0,
        },
        [TxTableColumns.TxId]: tx.tx_id,
        [TxTableColumns.TxType]: tx.tx_type,
        [TxTableColumns.From]: {
          address: tx.sender_address,
          isContract: validateStacksContractId(tx.sender_address),
        },
        [TxTableColumns.ArrowRight]: <ArrowRight />,
        [TxTableColumns.To]: {
          address: to,
          isContract: validateStacksContractId(to),
        },
        [TxTableColumns.Fee]: tx.fee_rate,
        [TxTableColumns.Amount]: amount,
        [TxTableColumns.BlockTime]: tx.receipt_time,
      };
    });
  }, [txs]);

  return (
    <Table
      data={rowData}
      columns={columnDefinitions ?? defaultColumnDefinitions}
      tableContainerWrapper={table => <TableContainer minH="500px">{table}</TableContainer>}
      scrollIndicatorWrapper={table => <TableScrollIndicator>{table}</TableScrollIndicator>}
      pagination={
        disablePagination
          ? undefined
          : {
              manualPagination: true,
              pageIndex: pagination.pageIndex,
              pageSize: pagination.pageSize,
              totalRows: response.data?.pages[0]?.total || 0,
              onPageChange: handlePageChange,
            }
      }
      bannerRow={
        newTxsAvailable && pagination.pageIndex === 0 && !isTableFiltered ? (
          <UpdateTableBannerRow
            onClick={() => {
              setNewTxsAvailable(false);
              response.refetch();
            }}
          />
        ) : null
      }
      isLoading={response.isLoading}
      isFetching={response.isFetching}
    />
  );
}
