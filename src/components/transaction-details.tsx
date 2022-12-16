import { BlocksVisualizer } from '@features/blocks-visualizer';
import { IconArrowDownRight, IconArrowUpRight } from '@tabler/icons';
import QuestionMarkCircleOutlineIcon from 'mdi-react/QuestionMarkCircleOutlineIcon';
import * as React from 'react';

import { Block, MempoolTransaction, Transaction } from '@stacks/stacks-blockchain-api-types';
import { Box, Flex, Stack, Text, color } from '@stacks/ui';

import { TransactionStatus } from '@common/constants';
import { getMemoString, microToStacks } from '@common/utils';
import { getTransactionStatus } from '@common/utils/transactions';

import { Badge } from '@components/badge';
import { BtcStxBlockLinks } from '@components/btc-stx-block-links';
import { Circle } from '@components/circle';
import { IconButton } from '@components/icon-button';
import { StxInline } from '@components/icons/stx-inline';
import { BlockLink, ExplorerLink, TxLink } from '@components/links';
import { Rows } from '@components/rows';
import { Section } from '@components/section';
import { Timestamp } from '@components/timestamp';
import { Link } from '@components/typography';

import { StxPriceButton } from '@modules/stxPrice/StxPriceButton';

interface FeeComponentProps {
  tx: Transaction | MempoolTransaction;
}

const FeesComponent = React.memo(({ tx }: FeeComponentProps) => {
  return (
    <>
      <Flex
        flexDirection={['column', 'column', 'row']}
        alignItems={['flex-start', 'flex-start', 'center']}
      >
        <Text>{microToStacks(tx.fee_rate)} STX</Text>
        <StxPriceButton tx={tx} value={Number(tx.fee_rate)} />
      </Flex>
      {tx.sponsored ? (
        <Badge ml="base" bg="ink.300">
          Sponsored
        </Badge>
      ) : null}
    </>
  );
});

const BlockComponent = React.memo(
  ({
    btcBlockHeight,
    stxBlockHeight,
    stxBlockHash,
    ts,
  }: {
    btcBlockHeight?: number;
    stxBlockHeight: number;
    stxBlockHash: string;
    ts: number;
  }) => {
    return (
      <>
        <BtcStxBlockLinks
          btcBlockHeight={btcBlockHeight}
          stxBlockHeight={stxBlockHeight}
          stxBlockHash={stxBlockHash}
        />
        {/* MICROBLOCK TODO: Make this real data if possible? */}
        {/* <Box ml="extra-tight">(6 confirmations)</Box> */}
        <Box ml="base">
          <Timestamp ts={ts} />
        </Box>
      </>
    );
  }
);

const AddressComponent = React.memo(({ principal }: { principal: string }) => {
  return (
    <ExplorerLink path={`/address/${encodeURIComponent(principal)}`}>
      <Link as="a">{principal}</Link>
    </ExplorerLink>
  );
});

const NoncesComponent = React.memo(({ nonce }: { nonce: number }) => {
  return <Text display="block">{nonce}</Text>;
});

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

const transformDataToRowData = (tx: Transaction | MempoolTransaction, block?: Block) => {
  const txid = {
    label: {
      children: 'Transaction ID',
    },
    children: tx.tx_id,
    copy: tx.tx_id,
  };
  const canonical = {
    condition:
      (tx.tx_status !== TransactionStatus.PENDING && 'canonical' in tx && !tx.canonical) ||
      ('microblock_canonical' in tx && !tx.microblock_canonical),
    label: {
      children: 'Non-canonical',
    },
    children: (
      <Flex alignItems="center">
        <Box>
          Transaction is in a non-canonical fork. It has been orphaned by the canonical chain.
        </Box>
        <IconButton
          ml="tight"
          icon={QuestionMarkCircleOutlineIcon}
          dark
          as="a"
          href="https://github.com/stacksgov/sips/blob/main/sips/sip-001/sip-001-burn-election.md#committing-to-a-chain-tip"
          target="_blank"
        />
      </Flex>
    ),
  };
  const contractName =
    tx.tx_type === 'contract_call'
      ? {
          condition: tx.tx_type === 'contract_call',
          label: {
            children: 'Contract',
          },
          children:
            tx.tx_type === 'contract_call' ? (
              <TxLink txid={tx.contract_call.contract_id}>
                <Link as="a">{tx.contract_call.contract_id}</Link>
              </TxLink>
            ) : (
              ''
            ),
          copy: tx.tx_type === 'contract_call' ? tx.contract_call.contract_id : '',
        }
      : {
          condition: tx.tx_type === 'smart_contract',
          label: {
            children: 'Contract name',
          },
          children: tx.tx_type === 'smart_contract' ? tx.smart_contract.contract_id : '',
          copy: tx.tx_type === 'smart_contract' ? tx.smart_contract.contract_id : '',
        };
  const sender = {
    condition: typeof tx.sender_address !== 'undefined',
    label: {
      children: getSenderName(tx.tx_type),
    },
    children: <AddressComponent principal={tx.sender_address} />,
    copy: tx.sender_address,
  };
  const nonce = {
    label: {
      children: `Nonce`,
    },
    children: <NoncesComponent nonce={tx.nonce} />,
    copy: tx.nonce,
  };
  const fees = {
    label: {
      children: 'Fees',
    },
    children: <FeesComponent tx={tx} />,
  };
  const blockTime = {
    condition:
      'block_height' in tx &&
      typeof tx.block_height !== 'undefined' &&
      !(tx?.tx_status === 'success' && tx.is_unanchored), // exclude block height row from txs in microblocks
    label: {
      children: 'Block height',
    },
    children:
      'block_height' in tx ? (
        <BlockComponent
          stxBlockHeight={tx.block_height}
          stxBlockHash={tx.block_hash}
          btcBlockHeight={block?.burn_block_height}
          ts={tx.parent_burn_block_time || tx.burn_block_time}
        />
      ) : null,
  };
  const blockHash = {
    condition:
      'block_hash' in tx &&
      typeof tx.block_hash !== 'undefined' &&
      !(tx?.tx_status === 'success' && tx.is_unanchored), // exclude block hash row from txs in microblocks,
    label: {
      children: 'Block hash',
    },
    children: 'block_hash' in tx && (
      <BlockLink hash={tx.block_hash}>
        <Link>{tx.block_hash}</Link>
      </BlockLink>
    ),
    copy: 'block_hash' in tx && tx.block_hash,
  };

  switch (tx.tx_type) {
    case 'token_transfer': {
      const amount = {
        label: 'Amount',
        children: (
          <Flex
            flexDirection={['column', 'column', 'row']}
            alignItems={['flex-start', 'flex-start', 'center']}
          >
            <Stack alignItems="flex-start" isInline spacing="tight">
              <Box width="24px" position="relative">
                <Circle position="absolute" left={0} size="24px" bg={color('accent')}>
                  <StxInline strokeWidth={2} size="14px" color="white" />
                </Circle>
              </Box>

              <Text fontSize="16px" color={color('text-title')} fontWeight="500">
                {microToStacks(tx.token_transfer.amount)}{' '}
                <Text as="span" display="inline" opacity="0.5">
                  STX
                </Text>
              </Text>
            </Stack>
            <StxPriceButton tx={tx} value={Number(tx.token_transfer.amount)} />
          </Flex>
        ),
      };
      const tokenTransferSender = {
        condition: typeof tx.sender_address !== 'undefined',
        label: {
          children: getSenderName(tx.tx_type),
        },
        children: (
          <Stack isInline>
            <Box color={color('text-caption')}>
              <IconArrowUpRight size="16px" />
            </Box>
            <AddressComponent principal={tx.sender_address} />
          </Stack>
        ),
        copy: tx.sender_address,
      };
      const recipient = {
        label: {
          children: 'Recipient',
        },
        children: (
          <Stack isInline>
            <Box color={color('text-caption')}>
              <IconArrowDownRight size="16px" />
            </Box>
            <AddressComponent principal={tx.token_transfer.recipient_address} />
          </Stack>
        ),
        copy: tx.token_transfer.recipient_address,
      };

      const memo = {
        condition: !!getMemoString(tx.token_transfer.memo),
        label: { children: 'Memo' },
        children: getMemoString(tx.token_transfer.memo),
      };

      return [
        amount,
        tokenTransferSender,
        recipient,
        txid,
        fees,
        nonce,
        blockTime,
        blockHash,
        memo,
        canonical,
      ];
    }
    case 'coinbase': {
      const scratch = {
        condition:
          tx.coinbase_payload.data !==
          '0x0000000000000000000000000000000000000000000000000000000000000000',
        label: {
          children: 'Scratch space',
        },
        children: tx.coinbase_payload.data,
      };
      const altRecipient = {
        condition: !!tx.coinbase_payload.alt_recipient,
        label: {
          children: 'Alt recipient',
        },
        children: tx.coinbase_payload.alt_recipient,
      };
      return [txid, sender, fees, nonce, blockTime, blockHash, scratch, canonical, altRecipient];
    }
    case 'smart_contract': {
      const clarityVersion = {
        condition: true,
        label: {
          children: 'Clarity version',
        },
        children: tx.smart_contract?.clarity_version || '1',
      };
      return [
        contractName,
        txid,
        sender,
        fees,
        nonce,
        blockTime,
        blockHash,
        canonical,
        clarityVersion,
      ];
    }
    default:
      return [contractName, txid, sender, fees, nonce, blockTime, blockHash, canonical];
  }
};

interface TransactionDetailsProps {
  transaction: Transaction | MempoolTransaction;
  hideContract?: boolean;
  contractName?: string;
  contractMeta?: string;
  block?: Block;
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
  block,
  ...rest
}) => {
  const txStatus = getTransactionStatus(transaction);
  const showBlocksVisualizer = txStatus === 'success_microblock' || txStatus === 'pending';
  return (
    <>
      <Section title="Summary" {...rest}>
        <Flex px="base" width="100%" flexDirection={['column', 'column', 'row']}>
          <Box width={['100%']}>
            <Rows noTopBorder items={transformDataToRowData(transaction, block) as any} />
          </Box>
        </Flex>
      </Section>
      {showBlocksVisualizer && (
        <Section title="Blocks" {...rest}>
          <Flex px="base" width="100%" flexDirection={['column', 'column', 'row']}>
            <Box width={['100%']} margin={'24px 0'}>
              <BlocksVisualizer />
            </Box>
          </Flex>
        </Section>
      )}
    </>
  );
};
