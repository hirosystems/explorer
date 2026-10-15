import { useTxIdPageData } from '@/app/txid/[txId]/TxIdPageContext';
import { AddressLink, TxLink } from '@/common/components/ExplorerLinks';
import { TxDetailsOf } from '@/common/types/tx-v3';
import { formatBlockTime } from '@/common/utils/time-utils';
import { isConfirmedTx } from '@/common/utils/transaction-utils';
import { getTxBlockTime, isConfirmedTxDetails } from '@/common/utils/tx-details-utils';
import { Badge, BlockHeightBadge, DefaultBadgeLabel } from '@/ui/Badge';
import { Flex } from '@chakra-ui/react';

import { ExecutionCostItem } from './ExecutionCost';
import { PriceSummaryItemValue, SponsorTag, SummaryItem } from './SummaryItem';

export const SmartContractTxSummaryItems = ({ tx }: { tx: TxDetailsOf<'smart_contract'> }) => {
  const { stxPrice } = useTxIdPageData();
  const isSponsored = tx.sponsor !== null;
  const sponsor = tx.sponsor?.address;

  return (
    <>
      <SummaryItem
        label="Contract address"
        value={tx.smart_contract?.contract_id}
        valueRenderer={value => (
          <AddressLink address={value} wordBreak="break-all" variant="tableLink">
            {value}
          </AddressLink>
        )}
        showCopyButton
      />
      <SummaryItem
        label="Transaction ID"
        value={tx.tx_id}
        valueRenderer={value => (
          <TxLink txId={value} wordBreak="break-all" variant="tableLink">
            {value}
          </TxLink>
        )}
        showCopyButton
      />
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

      {isConfirmedTxDetails(tx) && getTxBlockTime(tx) && (
        <SummaryItem
          label="Timestamp"
          value={formatBlockTime(getTxBlockTime(tx))}
          valueRenderer={value => (
            <Badge
              variant="solid"
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
      {isConfirmedTxDetails(tx) && tx.bitcoin_block.height && (
        <SummaryItem
          label="Burn Block"
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
};
