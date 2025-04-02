import { getAmount, getToAddress } from '@/app/transactions/utils';
import { CopyButtonRedesign } from '@/common/components/CopyButton';
import { AddressLink } from '@/common/components/ExplorerLinks';
import { formatBlockTime } from '@/common/utils/time-utils';
import { Badge, BlockHeightBadge, DefaultBadgeLabel, TransactionStatusBadge } from '@/ui/Badge';
import { Text } from '@/ui/Text';
import StacksIconThin from '@/ui/icons/StacksIconThin';
import { Flex, Icon, Stack } from '@chakra-ui/react';

import { TokenTransferTransaction } from '@stacks/stacks-blockchain-api-types';

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
      <CopyButtonRedesign
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
      <CopyButtonRedesign
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
          <CopyButtonRedesign
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

export function TokenTransferTxSummary({ tx }: { tx: TokenTransferTransaction }) {
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
