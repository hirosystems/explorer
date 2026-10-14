import { AddressLink } from '@/common/components/ExplorerLinks';
import { TxDetailsOf } from '@/common/types/tx-v3';
import { formatBlockTime } from '@/common/utils/time-utils';
import {
  getTxBlockTime,
  getTxDetailsToAddress,
  isConfirmedTxDetails,
} from '@/common/utils/tx-details-utils';
import { getMemoString } from '@/common/utils/utils';
import { Badge, BlockHeightBadge, DefaultBadgeLabel } from '@/ui/Badge';
import { Text } from '@/ui/Text';
import { Flex, Stack } from '@chakra-ui/react';

import { useTxIdPageData } from '../../TxIdPageContext';
import { ExecutionCostItem } from './ExecutionCost';
import { PriceSummaryItemValue, SponsorTag, SummaryItem } from './SummaryItem';

export function TokenTransferTxSummaryItems({ tx }: { tx: TxDetailsOf<'token_transfer'> }) {
  const { stxPrice } = useTxIdPageData();
  const isSponsored = tx.sponsor !== null;
  const sponsor = tx.sponsor?.address;

  return (
    <>
      <SummaryItem label="ID" value={tx.tx_id} showCopyButton />
      {isConfirmedTxDetails(tx) && (
        <SummaryItem
          label="Amount"
          value={tx.token_transfer.amount}
          valueRenderer={value => <PriceSummaryItemValue value={value} stxPrice={stxPrice} />}
        />
      )}
      <SummaryItem
        label="By"
        value={tx.sender.address}
        valueRenderer={value => (
          <AddressLink address={value} wordBreak="break-all" variant="tableLink">
            {value}
          </AddressLink>
        )}
        showCopyButton
      />
      <SummaryItem
        label="Target"
        value={getTxDetailsToAddress(tx)}
        valueRenderer={value => (
          <AddressLink address={value} wordBreak="break-all" variant="tableLink">
            {value}
          </AddressLink>
        )}
        showCopyButton
      />
      {isConfirmedTxDetails(tx) && (
        <SummaryItem
          label="Timestamp"
          value={formatBlockTime(getTxBlockTime(tx))}
          valueRenderer={value => (
            <Badge
              variant="solid"
              type="tag"
              _groupHover={{
                bg: 'surfaceTertiary',
              }}
            >
              <DefaultBadgeLabel label={value} fontFamily="matterMono" suppressHydrationWarning />
            </Badge>
          )}
          showCopyButton
        />
      )}
      <SummaryItem
        label="Fee"
        value={tx.fee_rate}
        valueRenderer={value => (
          <Flex gap={2} alignItems="center">
            <PriceSummaryItemValue value={value} stxPrice={stxPrice} />
            <SponsorTag isSponsored={isSponsored} sponsor={sponsor} />
          </Flex>
        )}
      />
      <SummaryItem
        label="Memo"
        value={tx.token_transfer.memo?.hex ?? ''}
        valueRenderer={value => {
          const decoded = getMemoString(value);
          return (
            <Stack gap={0.5}>
              {decoded && (
                <Text textStyle="text-regular-sm" color="textPrimary" wordBreak="break-all">
                  {decoded}
                </Text>
              )}
              <Text
                textStyle="text-regular-sm"
                color={decoded ? 'textSecondary' : 'textPrimary'}
                wordBreak="break-all"
              >
                {value}
              </Text>
            </Stack>
          );
        }}
        showCopyButton
      />
      <SummaryItem label="Nonce" value={tx.sender.nonce.toString()} showCopyButton />
      {isConfirmedTxDetails(tx) && (
        <SummaryItem
          label="Block height"
          value={tx.block.height.toString()}
          showCopyButton
          valueRenderer={value => (
            <BlockHeightBadge
              blockType="stx"
              blockHeight={Number(value)}
              _groupHover={{
                bg: 'surfaceTertiary',
              }}
            />
          )}
        />
      )}
      {isConfirmedTxDetails(tx) && (
        <SummaryItem
          label="Bitcoin Anchor"
          value={tx.bitcoin_block.height.toString()}
          showCopyButton
          valueRenderer={value => (
            <BlockHeightBadge
              blockType="btc"
              blockHeight={Number(value)}
              _groupHover={{
                bg: 'surfaceTertiary',
              }}
            />
          )}
        />
      )}
      {isConfirmedTxDetails(tx) && <ExecutionCostItem tx={tx} />}
    </>
  );
}
