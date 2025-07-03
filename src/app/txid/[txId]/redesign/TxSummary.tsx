import { formatBlockTime, getAmount, getToAddress } from '@/app/transactions/utils';
import { CopyButtonNew } from '@/common/components/CopyButton';
import { AddressLink, BlockLink } from '@/common/components/ExplorerLinks';
import { capitalize } from '@/common/utils/utils';
import { Badge, BlockHeightBadge, DefaultBadgeLabel, TransactionStatusBadge } from '@/ui/Badge';
import { Text } from '@/ui/Text';
import StacksIconThin from '@/ui/icons/StacksIconThin';
import { Box, Flex, Grid, Icon, Stack } from '@chakra-ui/react';
import React from 'react';

import {
  MempoolTenureChangeTransaction,
  MempoolTokenTransferTransaction,
  MempoolTransaction,
  TenureChangeTransaction,
  TokenTransferTransaction,
  Transaction,
} from '@stacks/stacks-blockchain-api-types';

import { useTxIdPageData } from '../TxIdPageContext';

function SummaryItemLabel({ label }: { label: string }) {
  return (
    <Text textStyle="text-medium-sm" color="textSecondary">
      {label}
    </Text>
  );
}

function SummaryItemValue({
  value,
  valueRenderer,
  label,
  copyable,
}: {
  value: string;
  valueRenderer?: (value: string) => React.ReactNode;
  label: string;
  copyable?: boolean;
}) {
  const content = valueRenderer ? (
    valueRenderer(value)
  ) : (
    <Text textStyle="text-regular-sm" color="textPrimary" wordBreak="break-all">
      {value}
    </Text>
  );
  return (
    <Flex gap={2} alignItems="center">
      {content}
      {copyable && (
        <CopyButtonNew
          initialValue={value}
          aria-label={`copy ${label} value`}
          height={3.5}
          width={3.5}
          color="iconSecondary"
        />
      )}
    </Flex>
  );
}

function PriceSummaryItemValue({ value }: { value: string }) {
  const { stxPrice } = useTxIdPageData();
  const usdValue = stxPrice * Number(value);

  return (
    <Flex gap={1.5} alignItems="center">
      <Icon h={3.5} w={3.5} color="iconPrimary">
        <StacksIconThin />
      </Icon>
      {value} STX
      <CopyButtonNew
        initialValue={value}
        aria-label={`copy stx price`}
        height={3.5}
        width={3.5}
        color="iconSecondary"
      />
      <Text textStyle="text-regular-sm" color="textSecondary">
        /
      </Text>
      <Text textStyle="text-regular-sm" color="textSecondary">
        ${usdValue}
      </Text>
      <CopyButtonNew
        initialValue={usdValue.toString()}
        aria-label={`copy usd price`}
        height={3.5}
        width={3.5}
        color="iconSecondary"
      />
    </Flex>
  );
}

export function SummaryItem({
  label,
  value,
  valueRenderer,
  copyable,
}: {
  label: string;
  value: string;
  valueRenderer?: (value: string) => React.ReactNode;
  copyable?: boolean;
}) {
  return (
    <>
      <Stack hideFrom="md" gap={1.5} className="summary-item-mobile">
        <SummaryItemLabel label={label} />
        <SummaryItemValue
          value={value}
          label={label}
          valueRenderer={valueRenderer}
          copyable={copyable}
        />
      </Stack>
      <Box hideBelow="md" className="summary-item-label-desktop" p={3}>
        <SummaryItemLabel label={label} />
      </Box>
      <Box hideBelow="md" className="summary-item-value-desktop" p={3}>
        <SummaryItemValue
          value={value}
          label={label}
          valueRenderer={valueRenderer}
          copyable={copyable}
        />
      </Box>
    </>
  );
}

export function TokenTransferTxSummaryItems({
  tx,
}: {
  tx: TokenTransferTransaction | MempoolTokenTransferTransaction;
}) {
  return (
    <>
      <SummaryItem label="ID" value={tx.tx_id} copyable />
      <SummaryItem
        label="Status"
        value={tx.tx_status}
        valueRenderer={value => <TransactionStatusBadge tx={tx} />}
        copyable
      />
      {'amount' in tx && tx.amount && (
        <SummaryItem
          label="Amount"
          value={getAmount(tx as TokenTransferTransaction).toString()}
          valueRenderer={value => <PriceSummaryItemValue value={value} />}
        />
      )}
      <SummaryItem
        label="From"
        value={tx.sender_address}
        valueRenderer={value => (
          <AddressLink principal={value} wordBreak="break-all">
            {value}
          </AddressLink>
        )}
        copyable
      />
      <SummaryItem
        label="To"
        value={getToAddress(tx)}
        valueRenderer={value => (
          <AddressLink principal={value} wordBreak="break-all">
            {value}
          </AddressLink>
        )}
        copyable
      />
      {'block_time' in tx && tx.block_time && (
        <SummaryItem
          label="Timestamp"
          value={formatBlockTime(tx.block_time)}
          valueRenderer={value => (
            <Badge variant="solid">
              <DefaultBadgeLabel label={value} />
            </Badge>
          )}
          copyable
        />
      )}
      <SummaryItem
        label="Fee"
        value={tx.fee_rate}
        valueRenderer={value => <PriceSummaryItemValue value={value} />}
      />
      <SummaryItem label="Nonce" value={tx.nonce?.toString() || ''} copyable />
      {'block_height' in tx && tx.block_height && (
        <SummaryItem
          label="Block height"
          value={tx.block_height?.toString() || ''}
          copyable
          valueRenderer={value => <BlockHeightBadge blockType="stx" blockHeight={Number(value)} />}
        />
      )}
      {'burn_block_height' in tx && tx.burn_block_height && (
        <SummaryItem
          label="Bitcoin Anchor"
          value={tx.burn_block_height?.toString() || ''}
          copyable
          valueRenderer={value => <BlockHeightBadge blockType="btc" blockHeight={Number(value)} />}
        />
      )}
    </>
  );
}

export const TenureChangeTxSummaryItems = ({
  tx,
}: {
  tx: TenureChangeTransaction | MempoolTenureChangeTransaction;
}) => {
  return (
    <>
      <SummaryItem label="ID" value={tx.tx_id} copyable />
      <SummaryItem
        label="Status"
        value={tx.tx_status}
        valueRenderer={value => <TransactionStatusBadge tx={tx} />}
        copyable
      />
      <SummaryItem
        label="From"
        value={tx.sender_address}
        valueRenderer={value => (
          <AddressLink principal={value} wordBreak="break-all">
            {value}
          </AddressLink>
        )}
        copyable
      />
      {'block_time' in tx && tx.block_time && (
        <SummaryItem
          label="Timestamp"
          value={formatBlockTime(tx.block_time)}
          valueRenderer={value => (
            <Badge variant="solid">
              <DefaultBadgeLabel label={value} />
            </Badge>
          )}
          copyable
        />
      )}
      <SummaryItem
        label="Fee"
        value={tx.fee_rate}
        valueRenderer={value => <PriceSummaryItemValue value={value} />}
      />
      <SummaryItem label="Nonce" value={tx.nonce?.toString() || ''} copyable />
      <SummaryItem label="Cause" value={capitalize(tx.tenure_change_payload?.cause || '')} />
      {'block_height' in tx && tx.block_height && (
        <SummaryItem
          label="Block height"
          value={tx.block_height?.toString() || ''}
          copyable
          valueRenderer={value => <BlockHeightBadge blockType="stx" blockHeight={Number(value)} />}
        />
      )}
      {'block_hash' in tx && tx.block_hash && (
        <SummaryItem
          label="Block hash"
          value={tx.block_hash?.toString() || ''}
          copyable
          valueRenderer={value => (
            <BlockLink hash={value} wordBreak="break-all">
              {value}
            </BlockLink>
          )}
        />
      )}
      {/* <SummaryItem
        label="Tenure height"
        value={tx.tenure_change_payload?.previous_tenure_end || ''}
        copyable
        valueRenderer={value => <BlockHeightBadge blockType="stx" blockHeight={Number(value)} />}
      /> */}
      {'burn_block_height' in tx && tx.burn_block_height && (
        <SummaryItem
          label="Bitcoin Anchor"
          value={tx.burn_block_height?.toString() || ''}
          copyable
          valueRenderer={value => <BlockHeightBadge blockType="btc" blockHeight={Number(value)} />}
        />
      )}
      <SummaryItem
        label="Tenure consensus hash"
        value={tx.tenure_change_payload?.tenure_consensus_hash || ''}
        copyable
      />
      <SummaryItem
        label="Burn view consensus hash"
        value={tx.tenure_change_payload?.burn_view_consensus_hash || ''}
        copyable
      />
      <SummaryItem
        label="Previous tenure consensus hash"
        value={tx.tenure_change_payload?.prev_tenure_consensus_hash || ''}
        copyable
      />
      <SummaryItem
        label="Previous tenure end"
        value={tx.tenure_change_payload?.previous_tenure_end || ''}
        copyable
      />
      <SummaryItem
        label="Previous tenure blocks"
        value={tx.tenure_change_payload?.previous_tenure_blocks?.toString() || ''}
        copyable
      />
      <SummaryItem
        label="Pubkey hash"
        value={tx.tenure_change_payload?.pubkey_hash || ''}
        copyable
      />
    </>
  );
};

export function TxSummary({ tx }: { tx: Transaction | MempoolTransaction }) {
  let summary;
  if (tx.tx_type === 'coinbase') summary = null;
  if (tx.tx_type === 'token_transfer') summary = <TokenTransferTxSummaryItems tx={tx} />;
  if (tx.tx_type === 'contract_call') summary = null;
  if (tx.tx_type === 'smart_contract') summary = null;
  if (tx.tx_type === 'tenure_change') summary = <TenureChangeTxSummaryItems tx={tx} />;

  return (
    <Flex borderRadius="redesign.xl" border="1px solid" borderColor="redesignBorderSecondary" p={3}>
      <Grid
        templateColumns={{ base: '1fr', md: 'minmax(auto, max-content) 1fr' }}
        gap={{ base: 6, md: 0 }}
        // columnGap={6}
      >
        {summary}
      </Grid>
    </Flex>
  );
}
