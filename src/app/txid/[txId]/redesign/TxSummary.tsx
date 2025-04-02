import { CopyButtonRedesign } from '@/common/components/CopyButton';
import { AddressLink, BlockLink } from '@/common/components/ExplorerLinks';
import { formatBlockTime } from '@/common/utils/time-utils';
import { getAmount, getToAddress } from '@/common/utils/transaction-utils';
import { capitalize } from '@/common/utils/utils';
import { Badge, BlockHeightBadge, DefaultBadgeLabel, TransactionStatusBadge } from '@/ui/Badge';
import { Text } from '@/ui/Text';
import StacksIconThin from '@/ui/icons/StacksIconThin';
import { Flex, Icon, Stack, Table } from '@chakra-ui/react';

import {
  CoinbaseTransaction,
  ContractCallTransaction,
  MempoolCoinbaseTransaction,
  MempoolContractCallTransaction,
  MempoolTenureChangeTransaction,
  MempoolTokenTransferTransaction,
  MempoolTransaction,
  TenureChangeTransaction,
  TokenTransferTransaction,
  Transaction,
} from '@stacks/stacks-blockchain-api-types';

import { useTxIdPageData } from '../TxIdPageContext';

export function SummaryItemLabel({ label }: { label: string }) {
  return (
    <Text textStyle="text-medium-sm" color="textSecondary">
      {label}
    </Text>
  );
}

export function SummaryItemValue({
  value,
  valueRenderer,
  label,
  showCopyButton,
}: {
  value: string;
  valueRenderer?: (value: string) => React.ReactNode;
  label: string;
  showCopyButton?: boolean;
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
      {showCopyButton && (
        <CopyButtonRedesign
          initialValue={value}
          aria-label={`copy ${label} value`}
          iconProps={{
            height: 3.5,
            width: 3.5,
          }}
          buttonProps={{
            p: 1.5,
          }}
        />
      )}
    </Flex>
  );
}

export function PriceSummaryItemValue({ value }: { value: string }) {
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
        iconProps={{
          height: 3.5,
          width: 3.5,
        }}
        buttonProps={{
          p: 1.5,
        }}
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
        iconProps={{
          height: 3.5,
          width: 3.5,
        }}
        buttonProps={{
          p: 1.5,
        }}
      />
    </Flex>
  );
}

export function SummaryItem({
  label,
  value,
  valueRenderer,
  showCopyButton,
}: {
  label: string;
  value: string;
  valueRenderer?: (value: string) => React.ReactNode;
  showCopyButton?: boolean;
}) {
  return (
    <>
      <Table.Row
        hideBelow="md"
        className="group"
        bg="transparent"
        css={{
          '& > td:first-of-type': {
            borderTopLeftRadius: 'redesign.md',
            borderBottomLeftRadius: 'redesign.md',
          },
          '& > td:last-of-type': {
            borderTopRightRadius: 'redesign.md',
            borderBottomRightRadius: 'redesign.md',
          },
        }}
      >
        <Table.Cell
          _groupHover={{
            bg: 'surfacePrimary',
          }}
          border="none"
        >
          <SummaryItemLabel label={label} />
        </Table.Cell>
        <Table.Cell
          _groupHover={{
            bg: 'surfacePrimary',
          }}
          border="none"
        >
          <SummaryItemValue
            value={value}
            label={label}
            valueRenderer={valueRenderer}
            showCopyButton={showCopyButton}
          />
        </Table.Cell>
      </Table.Row>
      <Table.Row
        hideFrom="md"
        className="group"
        bg="transparent"
        css={{
          '& > td:first-of-type': {
            borderTopLeftRadius: 'redesign.md',
            borderBottomLeftRadius: 'redesign.md',
          },
          '& > td:last-of-type': {
            borderTopRightRadius: 'redesign.md',
            borderBottomRightRadius: 'redesign.md',
          },
        }}
      >
        <Table.Cell
          _groupHover={{
            bg: 'surfacePrimary',
          }}
          border="none"
        >
          <Stack gap={1.5}>
            <SummaryItemLabel label={label} />
            <SummaryItemValue
              value={value}
              label={label}
              valueRenderer={valueRenderer}
              showCopyButton={showCopyButton}
            />
          </Stack>
        </Table.Cell>
      </Table.Row>
    </>
  );
}

function isConfirmedTx<T extends Transaction, U extends MempoolTransaction>(tx: T | U): tx is T {
  return 'block_height' in tx && tx.block_height !== undefined;
}

export function TokenTransferTxSummaryItems({
  tx,
}: {
  tx: TokenTransferTransaction | MempoolTokenTransferTransaction;
}) {
  return (
    <>
      <SummaryItem label="ID" value={tx.tx_id} showCopyButton />
      <SummaryItem
        label="Status"
        value={tx.tx_status}
        valueRenderer={value => <TransactionStatusBadge tx={tx} />}
        showCopyButton
      />
      {isConfirmedTx<TokenTransferTransaction, MempoolTokenTransferTransaction>(tx) && (
        <SummaryItem
          label="Amount"
          value={getAmount(tx).toString()}
          valueRenderer={value => <PriceSummaryItemValue value={value} />}
        />
      )}
      <SummaryItem
        label="From"
        value={tx.sender_address}
        valueRenderer={value => (
          <AddressLink principal={value} wordBreak="break-all" variant="tableLink">
            {value}
          </AddressLink>
        )}
        showCopyButton
      />
      <SummaryItem
        label="To"
        value={getToAddress(tx)}
        valueRenderer={value => (
          <AddressLink principal={value} wordBreak="break-all" variant="tableLink">
            {value}
          </AddressLink>
        )}
        showCopyButton
      />
      {isConfirmedTx<TokenTransferTransaction, MempoolTokenTransferTransaction>(tx) && (
        <SummaryItem
          label="Timestamp"
          value={formatBlockTime(tx.block_time)}
          valueRenderer={value => (
            <Badge variant="solid">
              <DefaultBadgeLabel label={value} />
            </Badge>
          )}
          showCopyButton
        />
      )}
      <SummaryItem
        label="Fee"
        value={tx.fee_rate}
        valueRenderer={value => <PriceSummaryItemValue value={value} />}
      />
      <SummaryItem label="Nonce" value={tx.nonce?.toString() || ''} showCopyButton />
      {isConfirmedTx<TokenTransferTransaction, MempoolTokenTransferTransaction>(tx) && (
        <SummaryItem
          label="Block height"
          value={tx.block_height?.toString() || ''}
          showCopyButton
          valueRenderer={value => <BlockHeightBadge blockType="stx" blockHeight={Number(value)} />}
        />
      )}
      {isConfirmedTx<TokenTransferTransaction, MempoolTokenTransferTransaction>(tx) && (
        <SummaryItem
          label="Bitcoin Anchor"
          value={tx.burn_block_height?.toString() || ''}
          showCopyButton
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
      <SummaryItem label="ID" value={tx.tx_id} showCopyButton />
      <SummaryItem
        label="Status"
        value={tx.tx_status}
        valueRenderer={value => <TransactionStatusBadge tx={tx} />}
        showCopyButton
      />
      <SummaryItem
        label="From"
        value={tx.sender_address}
        valueRenderer={value => (
          <AddressLink principal={value} wordBreak="break-all" variant="tableLink">
            {value}
          </AddressLink>
        )}
        showCopyButton
      />
      {isConfirmedTx<TenureChangeTransaction, MempoolTenureChangeTransaction>(tx) && (
        <SummaryItem
          label="Timestamp"
          value={formatBlockTime(tx.block_time)}
          valueRenderer={value => (
            <Badge variant="solid">
              <DefaultBadgeLabel label={value} />
            </Badge>
          )}
          showCopyButton
        />
      )}
      <SummaryItem
        label="Fee"
        value={tx.fee_rate}
        valueRenderer={value => <PriceSummaryItemValue value={value} />}
      />
      <SummaryItem label="Nonce" value={tx.nonce?.toString() || ''} showCopyButton />
      <SummaryItem label="Cause" value={capitalize(tx.tenure_change_payload?.cause || '')} />
      {isConfirmedTx<TenureChangeTransaction, MempoolTenureChangeTransaction>(tx) && (
        <SummaryItem
          label="Block height"
          value={tx.block_height?.toString() || ''}
          showCopyButton
          valueRenderer={value => <BlockHeightBadge blockType="stx" blockHeight={Number(value)} />}
        />
      )}
      {isConfirmedTx<TenureChangeTransaction, MempoolTenureChangeTransaction>(tx) && (
        <SummaryItem
          label="Block hash"
          value={tx.block_hash?.toString() || ''}
          showCopyButton
          valueRenderer={value => (
            <BlockLink hash={value} wordBreak="break-all">
              {value}
            </BlockLink>
          )}
        />
      )}
      {isConfirmedTx<TenureChangeTransaction, MempoolTenureChangeTransaction>(tx) && (
        <SummaryItem
          label="Bitcoin Anchor"
          value={tx.burn_block_height?.toString() || ''}
          showCopyButton
          valueRenderer={value => <BlockHeightBadge blockType="btc" blockHeight={Number(value)} />}
        />
      )}
      <SummaryItem
        label="Tenure consensus hash"
        value={tx.tenure_change_payload?.tenure_consensus_hash || ''}
        showCopyButton
      />
      <SummaryItem
        label="Burn view consensus hash"
        value={tx.tenure_change_payload?.burn_view_consensus_hash || ''}
        showCopyButton
      />
      <SummaryItem
        label="Previous tenure end"
        value={tx.tenure_change_payload?.previous_tenure_end || ''}
        showCopyButton
      />
      <SummaryItem
        label="Previous tenure blocks"
        value={tx.tenure_change_payload?.previous_tenure_blocks?.toString() || ''}
        showCopyButton
      />
      <SummaryItem
        label="Pubkey hash"
        value={tx.tenure_change_payload?.pubkey_hash || ''}
        showCopyButton
      />
    </>
  );
};

export const CoinbaseTxSummaryItems = ({
  tx,
}: {
  tx: CoinbaseTransaction | MempoolCoinbaseTransaction;
}) => {
  return (
    <>
      <SummaryItem label="ID" value={tx.tx_id} showCopyButton />
      <SummaryItem
        label="Status"
        value={tx.tx_status}
        valueRenderer={value => <TransactionStatusBadge tx={tx} />}
        showCopyButton
      />
      <SummaryItem
        label="From"
        value={tx.sender_address}
        valueRenderer={value => (
          <AddressLink principal={value} wordBreak="break-all" variant="tableLink">
            {value}
          </AddressLink>
        )}
        showCopyButton
      />
      {isConfirmedTx<CoinbaseTransaction, MempoolCoinbaseTransaction>(tx) &&
        tx.coinbase_payload?.alt_recipient && (
          <SummaryItem
            label="Reward Recipient"
            value={tx.coinbase_payload?.alt_recipient}
            valueRenderer={value => (
              <AddressLink principal={value} wordBreak="break-all" variant="tableLink">
                {value}
              </AddressLink>
            )}
            showCopyButton
          />
        )}
      {isConfirmedTx<CoinbaseTransaction, MempoolCoinbaseTransaction>(tx) && (
        <SummaryItem
          label="Timestamp"
          value={formatBlockTime(tx.block_time)}
          valueRenderer={value => (
            <Badge variant="solid">
              <DefaultBadgeLabel label={value} />
            </Badge>
          )}
          showCopyButton
        />
      )}
      <SummaryItem
        label="Fee"
        value={tx.fee_rate}
        valueRenderer={value => <PriceSummaryItemValue value={value} />}
        showCopyButton
      />
      <SummaryItem label="Nonce" value={tx.nonce?.toString() || ''} showCopyButton />
      {isConfirmedTx<CoinbaseTransaction, MempoolCoinbaseTransaction>(tx) && (
        <SummaryItem
          label="Block height"
          value={tx.block_height?.toString() || ''}
          showCopyButton
          valueRenderer={value => <BlockHeightBadge blockType="stx" blockHeight={Number(value)} />}
        />
      )}
      {isConfirmedTx<CoinbaseTransaction, MempoolCoinbaseTransaction>(tx) && (
        <SummaryItem
          label="Block hash"
          value={tx.block_hash?.toString() || ''}
          showCopyButton
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
      {isConfirmedTx<CoinbaseTransaction, MempoolCoinbaseTransaction>(tx) && (
        <SummaryItem
          label="Bitcoin Anchor"
          value={tx.burn_block_height?.toString() || ''}
          showCopyButton
          valueRenderer={value => <BlockHeightBadge blockType="btc" blockHeight={Number(value)} />}
        />
      )}
    </>
  );
};

export const ContractCallTxSummaryItems = ({
  tx,
}: {
  tx: ContractCallTransaction | MempoolContractCallTransaction;
}) => {
  return (
    <>
      <SummaryItem
        label="ID"
        value={tx.tx_id}
        valueRenderer={value => (
          <AddressLink principal={value} wordBreak="break-all" variant="tableLink">
            {value}
          </AddressLink>
        )}
        showCopyButton
      />
      <SummaryItem
        label="Status"
        value={tx.tx_status}
        valueRenderer={value => <TransactionStatusBadge tx={tx} />}
        showCopyButton
      />
      <SummaryItem
        label="From"
        value={tx.sender_address}
        valueRenderer={value => (
          <AddressLink principal={value} wordBreak="break-all" variant="tableLink">
            {value}
          </AddressLink>
        )}
        showCopyButton
      />
      <SummaryItem
        label="To"
        value={tx.contract_call?.contract_id}
        valueRenderer={value => (
          <AddressLink principal={value} wordBreak="break-all" variant="tableLink">
            {value}
          </AddressLink>
        )}
        showCopyButton
      />
      {isConfirmedTx<ContractCallTransaction, MempoolContractCallTransaction>(tx) &&
        tx.block_time && (
          <SummaryItem
            label="Timestamp"
            value={formatBlockTime(tx.block_time)}
            valueRenderer={value => (
              <Badge variant="solid">
                <DefaultBadgeLabel label={value} />
              </Badge>
            )}
            showCopyButton
          />
        )}
      <SummaryItem
        label="Fee"
        value={tx.fee_rate}
        valueRenderer={value => <PriceSummaryItemValue value={value} />}
      />
      <SummaryItem label="Nonce" value={tx.nonce?.toString() || ''} showCopyButton />
      {'block_height' in tx && tx.block_height && (
        <SummaryItem
          label="Block height"
          value={tx.block_height?.toString() || ''}
          showCopyButton
          valueRenderer={value => <BlockHeightBadge blockType="stx" blockHeight={Number(value)} />}
        />
      )}
      {isConfirmedTx<ContractCallTransaction, MempoolContractCallTransaction>(tx) &&
        tx.block_hash && (
          <SummaryItem
            label="Block hash"
            value={tx.block_hash?.toString() || ''}
            showCopyButton
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
        showCopyButton
        valueRenderer={value => <BlockHeightBadge blockType="stx" blockHeight={Number(value)} />}
      /> */}
      {isConfirmedTx<ContractCallTransaction, MempoolContractCallTransaction>(tx) &&
        tx.burn_block_height && (
          <SummaryItem
            label="Bitcoin Anchor"
            value={tx.burn_block_height?.toString() || ''}
            showCopyButton
            valueRenderer={value => (
              <BlockHeightBadge blockType="btc" blockHeight={Number(value)} />
            )}
          />
        )}
    </>
  );
};

export function TxSummary({ tx }: { tx: Transaction | MempoolTransaction }) {
  let summaryContent;
  if (tx.tx_type === 'coinbase') summaryContent = <CoinbaseTxSummaryItems tx={tx} />;
  if (tx.tx_type === 'token_transfer') summaryContent = <TokenTransferTxSummaryItems tx={tx} />;
  if (tx.tx_type === 'contract_call') summaryContent = <ContractCallTxSummaryItems tx={tx} />;
  if (tx.tx_type === 'smart_contract') summaryContent = null;
  if (tx.tx_type === 'tenure_change') summaryContent = <TenureChangeTxSummaryItems tx={tx} />;

  return (
    <Table.Root w="full">
      <Table.Body>{summaryContent}</Table.Body>
    </Table.Root>
  );
}
