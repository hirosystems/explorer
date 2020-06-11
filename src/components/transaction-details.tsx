import * as React from 'react';
import { Box, Flex, Text } from '@blockstack/ui';
import { Badge } from '@components/badge';
import { Timestamp } from '@components/timestamp';
import { Rows } from '@components/rows';
import { ContractCard } from '@components/contract-card';
import { Transaction } from '@blockstack/stacks-blockchain-sidecar-types';
import { getMemoString, getContractName, microToStacks, truncateMiddle } from '@common/utils';

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

const BlockComponent = ({ block, ts }: { block: number | string; ts: number }) => {
  return (
    <>
      {/**
       * TODO: link to block
       */}
      <Box>#{block}</Box>
      <Box ml="base">
        <Timestamp ts={ts} />
      </Box>
    </>
  );
};

const transformDataToRowData = (d: Transaction) => {
  const txid = {
    label: {
      children: 'Transaction ID',
    },
    children: d.tx_id,
    copy: d.tx_id,
  };
  const contractName = {
    condition: d.tx_type === 'smart_contract',
    label: {
      children: 'Contract name',
    },
    children: d.tx_type === 'smart_contract' ? d.smart_contract.contract_id : '',
    copy: d.tx_type === 'smart_contract' ? d.smart_contract.contract_id : '',
  };
  const sender = {
    condition: typeof d.sender_address !== 'undefined',
    label: {
      children: 'Sender address',
    },
    children: d.sender_address,
    copy: d.sender_address,
  };
  const fees = {
    label: {
      children: 'Fees',
    },
    children: <FeesComponent fees={d.fee_rate} sponsored={d.sponsored} />,
  };
  const blockTime = {
    condition: typeof d.block_height !== 'undefined',
    label: {
      children: 'Block height',
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
  };
  const blockHash = {
    condition: typeof d.block_hash !== 'undefined',
    label: {
      children: 'Block hash',
    },
    children: d.block_hash,
  };

  switch (d.tx_type) {
    case 'token_transfer': {
      const recipient = {
        label: {
          children: 'Recipient address',
        },
        children: d.token_transfer.recipient_address,
      };

      const memo = {
        label: { children: 'Memo' },
        children: getMemoString(d.token_transfer.memo),
      };

      return [txid, contractName, sender, recipient, fees, blockTime, blockHash, memo];
    }
    case 'coinbase': {
      const scratch = {
        condition:
          d.coinbase_payload.data !==
          '0x0000000000000000000000000000000000000000000000000000000000000000',
        label: {
          children: 'Scratch space',
        },
        children: d.coinbase_payload.data,
      };
      return [txid, sender, fees, blockTime, blockHash, scratch];
    }
    default:
      return [txid, contractName, sender, fees, blockTime, blockHash];
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
  ...rest
}: TransactionDetailsProps) => {
  const contractId = getContractId(transaction);
  return (
    <Flex align="flex-start" flexDirection={['column', 'column', 'row']} {...rest}>
      <Box
        width={['100%']}
        order={[2, 2, 0]}
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
          mb={['loose', 'loose', 'unset']}
        />
      )}
    </Flex>
  );
};
