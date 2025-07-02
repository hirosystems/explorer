import { formatBlockTime, getAmount, getToAddress } from '@/app/transactions/utils';
import { CopyButtonNew } from '@/common/components/CopyButton';
import { AddressLink, BlockLink } from '@/common/components/ExplorerLinks';
import { Badge, BlockHeightBadge, DefaultBadgeLabel, TransactionStatusBadge } from '@/ui/Badge';
import { Text } from '@/ui/Text';
import StacksIconThin from '@/ui/icons/StacksIconThin';
import { Flex, FlexProps, GridProps, Icon, Stack } from '@chakra-ui/react';

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

function SummaryItemValue({ value }: { value: string }) {
  return (
    <Text textStyle="text-regular-sm" color="textPrimary" wordBreak="break-all">
      {value}
    </Text>
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

function SummaryItem({
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
    <Flex alignItems={['flex-start', 'center']} p={3} gap={2.5} flexDirection={['column', 'row']}>
      <Flex minW={30}>
        <SummaryItemLabel label={label} />
      </Flex>
      <Flex gap={2} alignItems="center">
        {valueRenderer ? valueRenderer(value) : <SummaryItemValue value={value} />}
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
    </Flex>
  );
}

export function SummaryItem2({
  label,
  value,
  valueRenderer,
  copyable,
}: {
  label: string;
  value: string;
  valueRenderer?: (value: string) => React.ReactNode;
  copyable?: boolean;
} & GridProps) {
  return (
    <>
      <DesktopSummaryItem
        hideBelow="sm"
        label={label}
        value={value}
        valueRenderer={valueRenderer}
        copyable={copyable}
      />
      <MobileSummaryItem
        hideFrom="sm"
        label={label}
        value={value}
        valueRenderer={valueRenderer}
        copyable={copyable}
      />
    </>
  );
}

function DesktopSummaryItem({
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
      <SummaryItemLabel label={label} />
      <Flex gap={2} alignItems="center">
        {valueRenderer ? valueRenderer(value) : <SummaryItemValue value={value} />}
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
    </>
  );
}

function DesktopSummaryItems({
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
      <SummaryItemLabel label={label} />
      <Flex gap={2} alignItems="center">
        {valueRenderer ? valueRenderer(value) : <SummaryItemValue value={value} />}
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
    </>
  );
}

function MobileSummaryItem({
  label,
  value,
  valueRenderer,
  copyable,
  ...flexProps
}: {
  label: string;
  value: string;
  valueRenderer?: (value: string) => React.ReactNode;
  copyable?: boolean;
} & FlexProps) {
  return (
    <Flex alignItems="flex-start" p={3} gap={2.5} flexDirection="column" {...flexProps}>
      <Flex minW={30}>
        <SummaryItemLabel label={label} />
      </Flex>
      <Flex gap={2} alignItems="center">
        {valueRenderer ? valueRenderer(value) : <SummaryItemValue value={value} />}
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
    </Flex>
  );
}

export function TokenTransferTxSummary({
  tx,
}: {
  tx: TokenTransferTransaction | MempoolTokenTransferTransaction;
}) {
  return (
    <Stack>
      <SummaryItem label="ID" value={tx.tx_id} copyable />
      <SummaryItem
        label="Status"
        value={tx.tx_status}
        valueRenderer={value => <TransactionStatusBadge tx={tx} />}
        copyable
      />
      <SummaryItem
        label="Amount"
        value={getAmount(tx).toString()}
        valueRenderer={value => <PriceSummaryItemValue value={value} />}
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
      <SummaryItem
        label="Fee"
        value={tx.fee_rate}
        valueRenderer={value => <PriceSummaryItemValue value={value} />}
      />
      <SummaryItem label="Nonce" value={tx.nonce?.toString() || ''} copyable />
      <SummaryItem
        label="Block height"
        value={tx.block_height?.toString() || ''}
        copyable
        valueRenderer={value => <BlockHeightBadge blockType="stx" blockHeight={Number(value)} />}
      />
      <SummaryItem
        label="Bitcoin Anchor"
        value={tx.burn_block_height?.toString() || ''}
        copyable
        valueRenderer={value => <BlockHeightBadge blockType="btc" blockHeight={Number(value)} />}
      />
    </Stack>
  );
}

export const TenureChangeTxSummary = ({
  tx,
}: {
  tx: TenureChangeTransaction | MempoolTenureChangeTransaction;
}) => {
  return (
    <Stack>
      <SummaryItem2 label="ID" value={tx.tx_id} copyable />
      <SummaryItem2
        label="Status"
        value={tx.tx_status}
        valueRenderer={value => <TransactionStatusBadge tx={tx} />}
        copyable
      />
      <SummaryItem2
        label="From"
        value={tx.sender_address}
        valueRenderer={value => (
          <AddressLink principal={value} wordBreak="break-all">
            {value}
          </AddressLink>
        )}
        copyable
      />
      <SummaryItem2
        label="Timestamp"
        value={formatBlockTime(tx.block_time)}
        valueRenderer={value => (
          <Badge variant="solid">
            <DefaultBadgeLabel label={value} />
          </Badge>
        )}
        copyable
      />
      <SummaryItem2
        label="Fee"
        value={tx.fee_rate}
        valueRenderer={value => <PriceSummaryItemValue value={value} />}
      />
      <SummaryItem2 label="Nonce" value={tx.nonce?.toString() || ''} copyable />
      <SummaryItem2
        label="Block height"
        value={tx.block_height?.toString() || ''}
        copyable
        valueRenderer={value => <BlockHeightBadge blockType="stx" blockHeight={Number(value)} />}
      />
      <SummaryItem2
        label="Block hash"
        value={tx.block_hash?.toString() || ''}
        copyable
        valueRenderer={value => (
          <BlockLink hash={value} wordBreak="break-all">
            {value}
          </BlockLink>
        )}
      />
      {/* <SummaryItem2
        label="Tenure height"
        value={tx.tenure_change_payload?.previous_tenure_end || ''}
        copyable
        valueRenderer={value => <BlockHeightBadge blockType="stx" blockHeight={Number(value)} />}
      /> */}
      <SummaryItem2
        label="Bitcoin Anchor"
        value={tx.burn_block_height?.toString() || ''}
        copyable
        valueRenderer={value => <BlockHeightBadge blockType="btc" blockHeight={Number(value)} />}
      />
      <SummaryItem2
        label="Tenure consensus hash"
        value={tx.tenure_change_payload?.tenure_consensus_hash || ''}
        copyable
      />
      <SummaryItem2
        label="Burn view consensus hash"
        value={tx.tenure_change_payload?.burn_view_consensus_hash || ''}
        copyable
      />
      <SummaryItem2
        label="Previous tenure consensus hash"
        value={tx.tenure_change_payload?.prev_tenure_consensus_hash || ''}
        copyable
      />
      <SummaryItem2
        label="Previous tenure end"
        value={tx.tenure_change_payload?.previous_tenure_end || ''}
        copyable
      />
      <SummaryItem2
        label="Previous tenure blocks"
        value={tx.tenure_change_payload?.previous_tenure_blocks?.toString() || ''}
        copyable
      />
      <SummaryItem2
        label="Pubkey hash"
        value={tx.tenure_change_payload?.pubkey_hash || ''}
        copyable
      />
    </Stack>
  );
};

export function TxSummary({ tx }: { tx: Transaction | MempoolTransaction }) {
  if (tx.tx_type === 'coinbase') return null;
  if (tx.tx_type === 'token_transfer') return <TokenTransferTxSummary tx={tx} />;
  if (tx.tx_type === 'contract_call') return null;
  if (tx.tx_type === 'smart_contract') return null;
  if (tx.tx_type === 'tenure_change') return <TenureChangeTxSummary tx={tx} />;
  return null;
}
