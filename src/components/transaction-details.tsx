import * as React from 'react';
import { Box, Flex, Text } from '@blockstack/ui';
import { Badge } from '@components/badge';
import { Timestamp } from '@components/timestamp';
import { Rows } from '@components/rows';
import { ContractCard } from '@components/contract-card';
import { Transaction } from '@blockstack/stacks-blockchain-sidecar-types';
import { getMemoString, getContractName, microToStacks } from '@common/utils';

interface FeeComponentProps {
  fees: string;
  sponsored: boolean;
}

const FeesComponent = ({ fees, sponsored }: FeeComponentProps) => (
  <>
    <Box>
      <Text>{microToStacks(fees)} STX</Text>
    </Box>
    {sponsored ? (
      <Badge ml="base" bg="ink.300">
        Sponsored
      </Badge>
    ) : null}
  </>
);

const BlockComponent = ({ block, ts }: { block: number | string; ts: number }) => (
  <>
    <Box>{block}</Box>
    <Box ml="base">
      <Timestamp ts={ts} />
    </Box>
  </>
);

const transformDataToRowData = (d: Transaction) => {
  const defaultData = [
    {
      label: {
        children: 'Transaction ID',
      },
      children: d.tx_id,
      copy: d.tx_id,
    },
    {
      condition: d.tx_type === 'smart_contract',
      label: {
        children: 'Contract address',
      },
      children: d.tx_type === 'smart_contract' ? d.smart_contract.contract_id : '',
      copy: d.tx_type === 'smart_contract' ? d.smart_contract.contract_id : '',
    },
    {
      label: {
        children: 'Sender address',
      },
      children: d.sender_address,
      copy: d.sender_address,
    },
    {
      label: {
        children: 'Transaction fees',
      },
      children: <FeesComponent fees={d.fee_rate} sponsored={d.sponsored} />,
    },
    {
      label: {
        children: 'Block',
      },
      children: (
        <BlockComponent
          block={d.block_height}
          ts={
            //@ts-ignore
            d.burn_block_time
          }
        />
      ),
    },
  ];
  switch (d.tx_type) {
    case 'token_transfer':
      return [
        ...defaultData,
        {
          label: { children: 'Memo' },
          children: getMemoString(d.token_transfer.memo),
        },
      ];
    default:
      return defaultData;
  }
};

interface TransactionDetailsProps {
  transaction: Transaction;
  hideContract?: boolean;
  contractName?: string;
  contractMeta?: string;
}

const getContractId = (transaction: Transaction) => {
  switch (transaction.tx_type) {
    case 'contract_call':
      return transaction.contract_call.contract_id;
    case 'smart_contract':
      return transaction.smart_contract.contract_id;
    default:
      return undefined;
  }
};

export const TransactionDetails = ({
  transaction,
  hideContract,

  contractMeta,
}: TransactionDetailsProps) => {
  const contractId = getContractId(transaction);
  return (
    <Flex align="flex-start" flexDirection={['column', 'column', 'row']}>
      <Box
        width={['100%']}
        order={[2, 2, 0]}
        mt={['extra-loose', 'extra-loose', 'unset']}
        mr={hideContract ? 'unset' : ['unset', 'unset', '72px']}
      >
        <Rows items={transformDataToRowData(transaction)} />
      </Box>
      {hideContract || !contractId ? null : (
        <ContractCard
          title={getContractName(contractId)}
          meta={contractMeta}
          contractId={transaction.tx_type === 'contract_call' ? contractId : undefined}
          order={[0, 0, 2]}
        />
      )}
    </Flex>
  );
};
