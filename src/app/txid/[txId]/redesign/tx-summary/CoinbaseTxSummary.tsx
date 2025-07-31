import { AddressLink, BlockLink } from '@/common/components/ExplorerLinks';
import { formatBlockTime } from '@/common/utils/time-utils';
import { isConfirmedTx } from '@/common/utils/transaction-utils';
import { Badge, BlockHeightBadge, DefaultBadgeLabel } from '@/ui/Badge';

import {
  CoinbaseTransaction,
  MempoolCoinbaseTransaction,
} from '@stacks/stacks-blockchain-api-types';

import { PriceSummaryItemValue, SummaryItem } from './TxSummary';

export const CoinbaseTxSummaryItems = ({
  tx,
}: {
  tx: CoinbaseTransaction | MempoolCoinbaseTransaction;
}) => {
  return (
    <>
      <SummaryItem label="ID" value={tx.tx_id} showCopyButton />
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
            <Badge variant="solid" type="tag">
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
            <BlockLink hash={value} wordBreak="break-all" variant="tableLink">
              {value}
            </BlockLink>
          )}
        />
      )}
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
