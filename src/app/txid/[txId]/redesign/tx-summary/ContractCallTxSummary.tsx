import { AddressLink, BlockLink } from '@/common/components/ExplorerLinks';
import { formatBlockTime } from '@/common/utils/time-utils';
import { isConfirmedTx } from '@/common/utils/transaction-utils';
import { Badge, BlockHeightBadge, DefaultBadgeLabel } from '@/ui/Badge';

import {
  ContractCallTransaction,
  MempoolContractCallTransaction,
} from '@stacks/stacks-blockchain-api-types';

import { PriceSummaryItemValue, SummaryItem } from './SummaryItem';

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
