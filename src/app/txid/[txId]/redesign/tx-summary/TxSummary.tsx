import { CopyButtonRedesign } from '@/common/components/CopyButton';
import { Text } from '@/ui/Text';
import StacksIconThin from '@/ui/icons/StacksIconThin';
import { Flex, Icon, Stack, Table } from '@chakra-ui/react';

import { MempoolTransaction, Transaction } from '@stacks/stacks-blockchain-api-types';

import { useTxIdPageData } from '../../TxIdPageContext';
import { CoinbaseTxSummaryItems } from './CoinbaseTxSummary';
import { TenureChangeTxSummaryItems } from './TenureChangeTxSummary';
import { TokenTransferTxSummaryItems } from './TokenTransferTxSummary';

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

export function TxSummary({ tx }: { tx: Transaction | MempoolTransaction }) {
  let summaryContent;
  if (tx.tx_type === 'coinbase') summaryContent = <CoinbaseTxSummaryItems tx={tx} />;
  if (tx.tx_type === 'token_transfer') summaryContent = <TokenTransferTxSummaryItems tx={tx} />;
  if (tx.tx_type === 'contract_call') summaryContent = null;
  if (tx.tx_type === 'smart_contract') summaryContent = null;
  if (tx.tx_type === 'tenure_change') summaryContent = <TenureChangeTxSummaryItems tx={tx} />;

  return (
    <Table.Root w="full" className="tx-details-summary">
      <Table.Body>{summaryContent}</Table.Body>
    </Table.Root>
  );
}
