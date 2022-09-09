import * as React from 'react';
import NextLink from 'next/link';

import { Box, color, Flex, Stack, Text } from '@stacks/ui';
import { getMemoString, getUsdValue, microToStacks } from '@common/utils';

import { Badge } from '@components/badge';
import { Link } from '@components/typography';
import { TransactionStatus } from '@common/constants';
import { Rows } from '@components/rows';
import { Timestamp } from '@components/timestamp';
import { MempoolTransaction, Transaction, Block } from '@stacks/stacks-blockchain-api-types';
import { Section } from '@components/section';
import { BlockLink, buildUrl, TxLink } from '@components/links';
import { IconButton } from '@components/icon-button';
import QuestionMarkCircleOutlineIcon from 'mdi-react/QuestionMarkCircleOutlineIcon';
import { StxInline } from '@components/icons/stx-inline';
import { Circle } from '@components/circle';
import { IconArrowDownRight, IconArrowUpRight } from '@tabler/icons';
import { BlocksVisualizer } from '@features/blocks-visualizer';
import { getTransactionStatus } from '@common/utils/transactions';
import { BtcStxBlockLinks } from '@components/btc-stx-block-links';
import { useCurrentStxPrice } from '@common/hooks/use-current-prices';

interface FeeComponentProps {
  fees: string;
  sponsored: boolean;
  currentStxPrice: number;
}

const FeesComponent = React.memo(({ fees, sponsored, currentStxPrice }: FeeComponentProps) => (
  <>
    <Flex
      flexDirection={['column', 'column', 'row']}
      alignItems={['flex-start', 'flex-start', 'center']}
    >
      <Text>{microToStacks(fees)} STX</Text>
      <Text color="ink.400" ml={['none', 'none', 'base']}>
        {getUsdValue(Number(fees), currentStxPrice, true)}
      </Text>
    </Flex>
    {sponsored ? (
      <Badge ml="base" bg="ink.300">
        Sponsored
      </Badge>
    ) : null}
  </>
));

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
    <NextLink href={buildUrl(`/address/${encodeURIComponent(principal)}`)} passHref>
      <Link as="a">{principal}</Link>
    </NextLink>
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

const transformDataToRowData = (
  d: Transaction | MempoolTransaction,
  currentStxPrice: number,
  block?: Block
) => {
  const txid = {
    label: {
      children: 'Transaction ID',
    },
    children: d.tx_id,
    copy: d.tx_id,
  };
  const canonical = {
    condition:
      (d.tx_status !== TransactionStatus.PENDING && 'canonical' in d && !d.canonical) ||
      ('microblock_canonical' in d && !d.microblock_canonical),
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
  const nonce = {
    label: {
      children: `Nonce`,
    },
    children: <NoncesComponent nonce={d.nonce} />,
    copy: d.nonce,
  };
  const fees = {
    label: {
      children: 'Fees',
    },
    children: (
      <FeesComponent fees={d.fee_rate} sponsored={d.sponsored} currentStxPrice={currentStxPrice} />
    ),
  };
  const blockTime = {
    condition: 'block_height' in d && typeof d.block_height !== 'undefined',
    label: {
      children: 'Block height',
    },
    children:
      'block_height' in d ? (
        <BlockComponent
          stxBlockHeight={d.block_height}
          stxBlockHash={d.block_hash}
          btcBlockHeight={block?.burn_block_height}
          ts={d.parent_burn_block_time || d.burn_block_time}
        />
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
                {microToStacks(d.token_transfer.amount)}{' '}
                <Text as="span" display="inline" opacity="0.5">
                  STX
                </Text>
              </Text>
            </Stack>
            <Text fontSize="14px" color="ink.400" ml={['extra-loose', 'extra-loose', 'base']}>
              {getUsdValue(Number(d.token_transfer.amount), currentStxPrice, true)}
            </Text>
          </Flex>
        ),
      };
      const tokenTransferSender = {
        condition: typeof d.sender_address !== 'undefined',
        label: {
          children: getSenderName(d.tx_type),
        },
        children: (
          <Stack isInline>
            <Box color={color('text-caption')}>
              <IconArrowUpRight size="16px" />
            </Box>
            <AddressComponent principal={d.sender_address} />
          </Stack>
        ),
        copy: d.sender_address,
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
            <AddressComponent principal={d.token_transfer.recipient_address} />
          </Stack>
        ),
        copy: d.token_transfer.recipient_address,
      };

      const memo = {
        condition: !!getMemoString(d.token_transfer.memo),
        label: { children: 'Memo' },
        children: getMemoString(d.token_transfer.memo),
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
          d.coinbase_payload.data !==
          '0x0000000000000000000000000000000000000000000000000000000000000000',
        label: {
          children: 'Scratch space',
        },
        children: d.coinbase_payload.data,
      };
      return [txid, sender, fees, nonce, blockTime, blockHash, scratch, canonical];
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
  const { data: currentStxPrice } = useCurrentStxPrice();
  const showBlocksVisualizer = txStatus === 'success_microblock' || txStatus === 'pending';
  return (
    <>
      <Section title="Summary" {...rest}>
        <Flex px="base" width="100%" flexDirection={['column', 'column', 'row']}>
          <Box width={['100%']}>
            <Rows
              noTopBorder
              items={transformDataToRowData(transaction, currentStxPrice, block) as any}
            />
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
