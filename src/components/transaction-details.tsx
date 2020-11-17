import * as React from 'react';

import { Box, Flex, Text } from '@stacks/ui';
import { getMemoString, microToStacks } from '@common/utils';

import { Badge } from '@components/badge';
import { Link } from '@components/typography';
import NextLink from 'next/link';
import { Rows } from '@components/rows';
import { Timestamp } from '@components/timestamp';
import { MempoolTransaction, Transaction } from '@blockstack/stacks-blockchain-api-types';
import { Section } from '@components/section';
import { BlockLink, TxLink } from '@components/links';
import { IconButton } from '@components/icon-button';
import QuestionMarkCircleOutlineIcon from 'mdi-react/QuestionMarkCircleOutlineIcon';

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

const AddressComponent = ({ principal }: any) => {
  return (
    <NextLink href={`/address/[principal]`} as={`/address/${principal}`} passHref>
      <Link as="a">{principal}</Link>
    </NextLink>
  );
};

const getSenderName = (txType: Transaction['tx_type']) => {
  switch (txType) {
    case 'smart_contract':
      return 'Deployed by';
    case 'contract_call':
      return 'Called by';
    default:
      return 'Sender address';
  }
};

const transformDataToRowData = (d: Transaction | MempoolTransaction) => {
  const txid = {
    label: {
      children: 'Transaction ID',
    },
    children: d.tx_id,
    copy: d.tx_id,
  };
  const canonical = {
    condition: d.tx_status !== 'pending' && !d.canonical,
    label: {
      children: 'Non-canonical',
    },
    children: (
      <Flex alignItems="center">
        <Box>This transaction is contained in a non-canonical fork of the Stacks chain.</Box>
        <IconButton
          ml="tight"
          icon={QuestionMarkCircleOutlineIcon}
          dark
          as="a"
          href="https://github.com/blockstack/stacks-blockchain/blob/master/sip/sip-001-burn-election.md#committing-to-a-chain-tip"
          target="_blank"
        />
      </Flex>
    ),
  };
  const contractName =
    d.tx_type === 'contract_call'
      ? {
          condition: d.tx_type === 'contract_call',
          label: {
            children: 'Contract',
          },
          children:
            d.tx_type === 'contract_call' ? (
              <TxLink txid={d.contract_call.contract_id}>
                <Link as="a">{d.contract_call.contract_id}</Link>
              </TxLink>
            ) : (
              ''
            ),
          copy: d.tx_type === 'contract_call' ? d.contract_call.contract_id : '',
        }
      : {
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
      children: getSenderName(d.tx_type),
    },
    children: <AddressComponent principal={d.sender_address} />,
    copy: d.sender_address,
  };
  const fees = {
    label: {
      children: 'Fees',
    },
    children: <FeesComponent fees={d.fee_rate} sponsored={d.sponsored} />,
  };
  const blockTime = {
    condition: 'block_height' in d && typeof d.block_height !== 'undefined',
    label: {
      children: 'Block height',
    },
    children:
      'block_height' in d ? (
        <BlockComponent block={d.block_height as number} ts={d.burn_block_time as number} />
      ) : null,
  };
  const blockHash = {
    condition: 'block_hash' in d && typeof d.block_hash !== 'undefined',
    label: {
      children: 'Block hash',
    },
    children: 'block_hash' in d && (
      <BlockLink hash={d.block_hash}>
        <Link>{d.block_hash}</Link>
      </BlockLink>
    ),
    copy: 'block_hash' in d && d.block_hash,
  };

  switch (d.tx_type) {
    case 'token_transfer': {
      const recipient = {
        label: {
          children: 'Recipient address',
        },
        children: <AddressComponent principal={d.token_transfer.recipient_address} />,
        copy: d.token_transfer.recipient_address,
      };

      const memo = {
        condition: !!getMemoString(d.token_transfer.memo),
        label: { children: 'Memo' },
        children: getMemoString(d.token_transfer.memo),
      };

      return [txid, contractName, sender, recipient, fees, blockTime, blockHash, memo, canonical];
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
      return [txid, sender, fees, blockTime, blockHash, scratch, canonical];
    }
    default:
      return [contractName, txid, sender, fees, blockTime, blockHash, canonical];
  }
};

interface TransactionDetailsProps {
  transaction: Transaction | MempoolTransaction;
  hideContract?: boolean;
  contractName?: string;
  contractMeta?: string;
}

export const getContractId = (transaction: Transaction | MempoolTransaction) => {
  switch (transaction.tx_type) {
    case 'contract_call':
      return transaction.contract_call.contract_id;
    case 'smart_contract':
      return transaction.smart_contract.contract_id;
    default:
      return undefined;
  }
};

export const TransactionDetails: React.FC<TransactionDetailsProps> = ({
  transaction,
  hideContract,
  contractMeta,
  contractName,
  ...rest
}) => {
  return (
    <Section title="Summary" {...rest}>
      <Flex px="base" width="100%" flexDirection={['column', 'column', 'row']}>
        <Box width={['100%']}>
          <Rows noTopBorder items={transformDataToRowData(transaction) as any} />
        </Box>
      </Flex>
    </Section>
  );
};
