import { AddressLink, BlockLink } from '@/common/components/ExplorerLinks';
import { TxDetailsOf } from '@/common/types/tx-v3';
import { formatBlockTime } from '@/common/utils/time-utils';
import { isConfirmedTx } from '@/common/utils/transaction-utils';
import {
  formatTenureChangeCause,
  getTxBlockTime,
  isConfirmedTxDetails,
} from '@/common/utils/tx-details-utils';
import { Badge, BlockHeightBadge, DefaultBadgeLabel } from '@/ui/Badge';
import { Flex } from '@chakra-ui/react';

import { useTxIdPageData } from '../../TxIdPageContext';
import { ExecutionCostItem } from './ExecutionCost';
import { PriceSummaryItemValue, SponsorTag, SummaryItem } from './SummaryItem';

export const TenureChangeTxSummaryItems = ({ tx }: { tx: TxDetailsOf<'tenure_change'> }) => {
  const { stxPrice } = useTxIdPageData();
  // v3 omits the tenure change payload for transactions still in the mempool.
  const tenureChange = isConfirmedTxDetails(tx) ? tx.tenure_change : undefined;
  const isSponsored = tx.sponsor !== null;
  const sponsor = tx.sponsor?.address;

  return (
    <>
      <SummaryItem label="ID" value={tx.tx_id} showCopyButton />
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
      <SummaryItem label="Nonce" value={tx.sender.nonce.toString()} showCopyButton />
      <SummaryItem
        label="Cause"
        value={tenureChange ? formatTenureChangeCause(tenureChange.cause) : ''}
      />
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
          label="Block hash"
          value={tx.block.hash?.toString() || ''}
          showCopyButton
          valueRenderer={value => (
            <BlockLink hash={value} wordBreak="break-all" variant="tableLink">
              {value}
            </BlockLink>
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
      <SummaryItem
        label="Tenure consensus hash"
        value={tenureChange?.tenure_consensus_hash || ''}
        showCopyButton
      />
      <SummaryItem
        label="Burn view consensus hash"
        value={tenureChange?.burn_view_consensus_hash || ''}
        showCopyButton
      />
      <SummaryItem
        label="Previous tenure end"
        value={tenureChange?.previous_tenure_end || ''}
        showCopyButton
      />
      <SummaryItem
        label="Previous tenure blocks"
        value={tenureChange?.previous_tenure_blocks?.toString() || ''}
        showCopyButton
      />
      <SummaryItem label="Pubkey hash" value={tenureChange?.pubkey_hash || ''} showCopyButton />
      {isConfirmedTxDetails(tx) && <ExecutionCostItem tx={tx} />}
    </>
  );
};
