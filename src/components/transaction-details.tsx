import * as React from 'react';
import { Box, Flex, Text } from '@blockstack/ui';
import { Badge } from '@components/badge';
import { Timestamp } from '@components/timestamp';
import { Rows } from '@components/rows';
import { ContractCard } from '@components/contract-card';
import { Transaction } from '@models/transaction.interface';

const data: Transaction = {
  block_hash: '',
  block_height: 34,
  tx_id: '84ee928fd3b61a9dee390fe62b606d28097cd43179a754100b49a45fb2206999',
  tx_status: 'success',
  tx_index: 1,
  fee_rate: '9 STX',
  sender_address: 'SP2X1KBV41VRZ4X3KMPZA2C53K2N4XX1P4VMKK697',
  tx_type: 'smart_contract',
  recipient: 'SP1P72Z3704VMT3DMHPP2CB8TGQWGDBHD3RPR9GZS',
  smart_contract: {
    contract_id: 'slkjdf',
    source_code: 'lkasdjflasjdflaksf',
  },
  sponsored: false,
  events: [],
};

const FeesComponent = ({
  fees: { amount, currency },
  sponsored,
}: {
  fees: {
    amount: string | number;
    currency: string;
  };
  sponsored: boolean;
}) => (
  <>
    <Box>
      <Text>
        {amount} {currency}
      </Text>
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
  return [
    {
      label: {
        children: 'Transaction ID',
      },
      children: d.txid,
      copy: d.txid,
    },
    {
      label: {
        children: 'Contract address',
      },
      children: d.sender,
      copy: d.sender,
    },
    {
      label: {
        children: 'Called by',
      },
      children: d.recipient,
      copy: d.recipient,
    },
    {
      label: {
        children: 'Transaction fees',
      },
      children: <FeesComponent fees={d.fees} sponsored={d.sponsored} />,
    },
    {
      label: {
        children: 'Block',
      },
      children: <BlockComponent block={d.block} ts={d.timestamp} />,
    },
  ];
};

export const TransactionDetails: React.FC = () => (
  <Flex align="flex-start" flexDirection={['column', 'column', 'row']}>
    <Box
      width={['100%']}
      order={[2, 2, 0]}
      mt={['extra-loose', 'extra-loose', 'unset']}
      mr={['unset', 'unset', '72px']}
    >
      <Rows items={transformDataToRowData(data)} />
    </Box>
    <ContractCard title="Stack-o-puppers" meta="stackopuppers.co" order={[0, 0, 2]} />
  </Flex>
);
