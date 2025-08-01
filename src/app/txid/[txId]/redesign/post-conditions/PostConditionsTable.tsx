import {
  AddressLinkCellRenderer,
  AddressLinkCellRendererProps,
} from '@/common/components/table/CommonTableCellRenderers';
import { Table } from '@/common/components/table/Table';
import { DefaultTableColumnHeader } from '@/common/components/table/TableComponents';
import {
  getContractName,
  truncateStxAddress,
  validateStacksContractId,
} from '@/common/utils/utils';
import { Flex } from '@chakra-ui/react';
import { ColumnDef, Header } from '@tanstack/react-table';

import {
  ContractCallTransaction,
  PostConditionFungibleConditionCode,
  PostConditionNonFungibleConditionCode,
} from '@stacks/stacks-blockchain-api-types';

enum PostConditionsTableColumns {
  From = 'from',
  Condition = 'condition',
  AssetAmount = 'assetAmount',
  To = 'to',
}

interface PostConditionsTableData {
  [PostConditionsTableColumns.From]: AddressLinkCellRendererProps;
  [PostConditionsTableColumns.Condition]: string;
  [PostConditionsTableColumns.AssetAmount]: string;
  [PostConditionsTableColumns.To]: string;
}

const columnDefinitions: ColumnDef<PostConditionsTableData>[] = [
  {
    id: PostConditionsTableColumns.From,
    header: 'From',
    accessorKey: PostConditionsTableColumns.From,
    cell: info => AddressLinkCellRenderer(info.getValue() as AddressLinkCellRendererProps),
    enableSorting: false,
  },
  {
    id: PostConditionsTableColumns.Condition,
    header: 'Condition',
    accessorKey: PostConditionsTableColumns.Condition,
    cell: info => info.getValue() as string,
    enableSorting: false,
    minSize: 150,
    maxSize: 150,
  },
  {
    id: PostConditionsTableColumns.AssetAmount,
    header: ({ header }: { header: Header<PostConditionsTableData, unknown> }) => (
      <Flex alignItems="center" justifyContent="flex-end">
        <DefaultTableColumnHeader header={header}>Asset/Amount</DefaultTableColumnHeader>
      </Flex>
    ),
    accessorKey: PostConditionsTableColumns.AssetAmount,
    cell: info => (
      <Flex alignItems="center" justifyContent="flex-end">
        {info.getValue() as string}
      </Flex>
    ),
    enableSorting: false,
  },
  {
    id: PostConditionsTableColumns.To,
    header: ({ header }: { header: Header<PostConditionsTableData, unknown> }) => (
      <Flex alignItems="center" justifyContent="flex-start">
        <DefaultTableColumnHeader header={header}>To</DefaultTableColumnHeader>
      </Flex>
    ),
    accessorKey: PostConditionsTableColumns.To,
    cell: info => (
      <Flex alignItems="center" justifyContent="flex-start">
        {info.getValue() as string}
      </Flex>
    ),
    enableSorting: false,
  },
];

interface PostConditionTableData {
  from: AddressLinkCellRendererProps;
  condition: string;
  assetAmount: string;
  to: string;
}

type PostConditionConditionCode =
  | PostConditionFungibleConditionCode
  | PostConditionNonFungibleConditionCode;

function getPostConditionCellText(postConditionCode: PostConditionConditionCode): string {
  if (postConditionCode === 'sent_equal_to') {
    return 'Transfers exactly';
  }
  if (postConditionCode === 'sent_greater_than') {
    return 'Transfers more than';
  }
  if (postConditionCode === 'sent_greater_than_or_equal_to') {
    return 'Transfers at least';
  }
  if (postConditionCode === 'sent_less_than') {
    return 'Transfers less than';
  }
  if (postConditionCode === 'sent_less_than_or_equal_to') {
    return 'Transfers at most';
  }
  if (postConditionCode === 'sent') {
    return 'Must transfer';
  }
  if (postConditionCode === 'not_sent') {
    return 'Must not transfer';
  }
  return 'Undefined post condition code';
}

function getRowData(tx: ContractCallTransaction): PostConditionTableData[] {
  const { post_conditions: postConditions } = tx;
  const senderAddress = tx.sender_address;
  const isContract = validateStacksContractId(senderAddress);
  const from = isContract ? getContractName(senderAddress) : truncateStxAddress(senderAddress);

  return postConditions.map(postCondition => {
    return {
      [PostConditionsTableColumns.From]: { address: from, isContract },
      [PostConditionsTableColumns.Condition]: getPostConditionCellText(
        postCondition.condition_code
      ),
      [PostConditionsTableColumns.AssetAmount]: {
        amount:
          postCondition.type === 'fungible' || postCondition.type === 'stx'
            ? postCondition.amount
            : '1',
        asset:
          postCondition.type === 'fungible' || postCondition.type === 'non_fungible'
            ? postCondition.asset.asset_name
            : 'STX',
      },
      [PostConditionsTableColumns.To]: postCondition.principal,
    };
  });
}

export function PostConditionsTable({ tx }: { tx: ContractCallTransaction }) {
  console.log('PostConditionsTable', { tx });
  const rowData = getRowData(tx);
  return <Table columns={columnDefinitions} data={rowData} />;
}
