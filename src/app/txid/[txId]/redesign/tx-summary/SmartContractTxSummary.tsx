import { AddressLink } from '@/common/components/ExplorerLinks';
import { formatBlockTime } from '@/common/utils/time-utils';
import { isConfirmedTx } from '@/common/utils/transaction-utils';
import { Badge, BlockHeightBadge, DefaultBadgeLabel } from '@/ui/Badge';

import {
  MempoolSmartContractTransaction,
  SmartContractTransaction,
} from '@stacks/stacks-blockchain-api-types';

import { PriceSummaryItemValue, SummaryItem } from './SummaryItem';

export const SmartContractTxSummaryItems = ({
  tx,
}: {
  tx: SmartContractTransaction | MempoolSmartContractTransaction;
}) => {
  return (
    <>
      <SummaryItem
        label="Contract address"
        value={tx.smart_contract?.contract_id}
        valueRenderer={value => (
          <AddressLink principal={value} wordBreak="break-all" variant="tableLink">
            {value}
          </AddressLink>
        )}
        showCopyButton
      />
      <SummaryItem
        label="Transaction ID"
        value={tx.tx_id}
        valueRenderer={value => (
          <AddressLink principal={value} wordBreak="break-all" variant="tableLink">
            {value}
          </AddressLink>
        )}
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

      {isConfirmedTx<SmartContractTransaction, MempoolSmartContractTransaction>(tx) &&
        tx.block_time && (
          <SummaryItem
            label="Timestamp"
            value={formatBlockTime(tx.block_time)}
            valueRenderer={value => (
              <Badge variant="solid">
                <DefaultBadgeLabel label={value} fontFamily="matterMono" />
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
      {isConfirmedTx<SmartContractTransaction, MempoolSmartContractTransaction>(tx) && (
        <SummaryItem
          label="Block height"
          value={tx.block_height?.toString() || ''}
          showCopyButton
          valueRenderer={value => <BlockHeightBadge blockType="stx" blockHeight={Number(value)} />}
        />
      )}
      {isConfirmedTx<SmartContractTransaction, MempoolSmartContractTransaction>(tx) &&
        tx.burn_block_height && (
          <SummaryItem
            label="Burn Block"
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
