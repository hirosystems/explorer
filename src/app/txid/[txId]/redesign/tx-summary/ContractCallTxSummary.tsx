import { getTxBlockTime, isConfirmedTxDetails } from '@/app/txid/[txId]/tx-details-utils';
import { AddressLink, BlockLink, TxLink } from '@/common/components/ExplorerLinks';
import { useTxEventsById } from '@/common/queries/useTxEventsById';
import { TxDetailsOf } from '@/common/types/tx-v3';
import { formatBlockTime } from '@/common/utils/time-utils';
import { Badge, BlockHeightBadge, DefaultBadgeLabel, StatusBadge } from '@/ui/Badge';
import { Text } from '@/ui/Text';
import { Flex } from '@chakra-ui/react';

import { useTxIdPageData } from '../../TxIdPageContext';
import { formatFunctionResult, getFunctionResultSuccessStatus } from '../function-called/utils';
import { ExecutionCostItem } from './ExecutionCost';
import { PriceSummaryItemValue, SponsorTag, SummaryItem } from './SummaryItem';
import { TokensTransferred, getTransferEvents } from './TokensTransferred';

// Only list transfers when one request returns every event.
const TOKENS_TRANSFERRED_MAX_EVENTS = 100;

export const ContractCallTxSummaryItems = ({ tx }: { tx: TxDetailsOf<'contract_call'> }) => {
  const { stxPrice } = useTxIdPageData();
  const isSponsored = tx.sponsor !== null;
  const sponsor = tx.sponsor?.address;

  const isConfirmed = isConfirmedTxDetails(tx);

  let resultValue = '';
  let resultSuccess = false;
  if (isConfirmed && tx.result) {
    const formattedResult = formatFunctionResult(tx.result);
    resultValue = formattedResult.map(r => r.value).join(', ');
    resultSuccess = getFunctionResultSuccessStatus(tx.result);
  }

  const txHasAllEvents =
    isConfirmed && tx.event_count > 0 && tx.event_count <= TOKENS_TRANSFERRED_MAX_EVENTS;
  const { data: eventsData } = useTxEventsById(tx.tx_id, TOKENS_TRANSFERRED_MAX_EVENTS, undefined, {
    enabled: txHasAllEvents,
    staleTime: Infinity,
  });
  const events = txHasAllEvents ? eventsData?.results || [] : [];
  const showTransfers = getTransferEvents(events).length > 0;

  return (
    <>
      <SummaryItem
        label="ID"
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
      <SummaryItem
        label="Interacted with (To)"
        value={tx.contract_call?.contract_id}
        valueRenderer={value => (
          <AddressLink address={value} wordBreak="break-all" variant="tableLink">
            {value}
          </AddressLink>
        )}
        showCopyButton
      />
      {isConfirmed && tx.result && (
        <SummaryItem
          label="Result"
          value={resultValue}
          valueRenderer={() => (
            <Flex gap={2} alignItems="center">
              <StatusBadge success={resultSuccess} successLabel="Success" failureLabel="Failure" />
              <Text textStyle="text-regular-sm" color="textPrimary">
                {resultValue}
              </Text>
            </Flex>
          )}
          showCopyButton
        />
      )}
      {showTransfers && (
        <SummaryItem
          label="Tokens Transferred"
          value=""
          valueRenderer={() => <TokensTransferred events={events} />}
        />
      )}
      {isConfirmed && getTxBlockTime(tx) && (
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
      {isConfirmed && (
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
      {isConfirmed && tx.block.hash && (
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
      {isConfirmed && tx.bitcoin_block.height && (
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
      {isConfirmed && <ExecutionCostItem tx={tx} />}
    </>
  );
};
