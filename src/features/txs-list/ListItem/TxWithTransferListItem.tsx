import exp from 'node:constants';
import pluralize from 'pluralize';
import React, { FC, memo } from 'react';

import { AddressTransaction } from '@stacks/blockchain-api-client/src/generated/models';
import { AddressTransactionWithTransfers, Transaction } from '@stacks/stacks-blockchain-api-types';

import { getTicker } from '../../../app/txid/[txId]/Events';
import { AddressArea } from '../../../common/components/transaction-item';
import { useInfiniteQueryResult } from '../../../common/hooks/useInfiniteQueryResult';
import { useAddressTransactionEventsInfinite } from '../../../common/queries/useAddressConfirmedTxsWithTransfersInfinite';
import { getAssetNameParts, microToStacksFormatted } from '../../../common/utils/utils';
import { AccordionButton } from '../../../ui/AccordionButton';
import { AccordionIcon } from '../../../ui/AccordionIcon';
import { AccordionItem } from '../../../ui/AccordionItem';
import { AccordionPanel } from '../../../ui/AccordionPanel';
import { Button } from '../../../ui/Button';
import { Flex } from '../../../ui/Flex';
import { HStack } from '../../../ui/HStack';
import { Stack } from '../../../ui/Stack';
import { Caption, Text } from '../../../ui/typography';
import { getTransactionTypeLabel } from '../utils';
import { FtTransfers, TransferListItemWithMetaSymbol } from './FtTransfers';
import { NftTransfers } from './NftTransfers';
import { StxTransfers } from './StxTransfers';
import { TransferListItem } from './TransferListItem';
import { TxListItem } from './TxListItem';

interface TxWithTransferListItemProps {
  tx: AddressTransaction;
  address?: string;
}

const LeftSubtitle: FC<{ tx: Transaction; eventsCount: number }> = memo(({ tx, eventsCount }) => (
  <HStack
    color={'secondaryText'}
    as="span"
    gap={1}
    alignItems="center"
    flexWrap="wrap"
    divider={<Caption>∙</Caption>}
  >
    <Caption fontWeight="semibold">{getTransactionTypeLabel(tx.tx_type)}</Caption>
    <Caption fontWeight="semibold">
      {eventsCount} {pluralize('event', eventsCount)}
    </Caption>
    <AddressArea tx={tx} />
  </HStack>
));

function TxEvents({ address, txId }: { address: string; txId: string }) {
  console.log(address, txId);
  const response = useAddressTransactionEventsInfinite(address, txId);
  const events = useInfiniteQueryResult(response);
  return (
    <>
      {events.map(event => {
        switch (event.type) {
          case 'ft':
            return (
              <TransferListItemWithMetaSymbol
                ftTransfer={event.data}
                key={`ft-transfer-${event.event_index}`}
                sender={event.data.sender}
                recipient={event.data.recipient}
                isOriginator={address === event.data.sender}
              />
            );
          case 'ntf':
            const collection = event.data.asset_identifier.split('::')[1] || 'NFT';
            const { asset } = getAssetNameParts(event.data.asset_identifier);
            const symbol = getTicker(asset).toUpperCase();
            return (
              <TransferListItem
                key={`nft-transfer-${event.event_index}`}
                title={`${collection} transfer`}
                sender={event.data.sender}
                recipient={event.data.recipient}
                amount={`1 ${symbol}`}
                isOriginator={address === event.data.sender}
              />
            );
          case 'stx':
            return (
              <TransferListItem
                key={`stx-transfer-${event.event_index}`}
                title={'STX transfer'}
                sender={event.data.sender}
                recipient={event.data.recipient}
                amount={`${
                  event.data.amount ? microToStacksFormatted(event.data.amount).toString() : '-'
                } STX`}
                isOriginator={address === event.data.sender}
              />
            );
        }
      })}
      {response.hasNextPage && (
        <Button variant={'secondary'} onClick={() => response.fetchNextPage()} width={'full'}>
          {response.isLoading ? 'Loading...' : `Load more events`}
        </Button>
      )}
    </>
  );
}

export const TxWithTransferListItem: FC<TxWithTransferListItemProps> = ({
  tx: { tx: transaction, stx_sent, stx_received, events },
  address,
}) => {
  const [expanded, setExpanded] = React.useState(false);
  if (!address) return null;
  const tx = transaction as any;
  const eventsCount =
    (events?.ft?.transfer || 0) +
    (events?.nft?.transfer || 0) +
    (events?.stx?.transfer || 0) +
    (events?.ft?.mint || 0) +
    (events?.nft?.mint || 0) +
    (events?.stx?.mint || 0) +
    (events?.ft?.burn || 0) +
    (events?.nft?.burn || 0) +
    (events?.stx?.burn || 0);
  return (
    <AccordionItem border={'none'} borderBottom={'1px'} _last={{ borderBottom: 'unset' }}>
      {({ isExpanded }) => (
        <>
          <Flex gap={1.5}>
            <TxListItem
              tx={tx}
              key={`txs-list-item-${tx.tx_id}`}
              leftSubtitle={<LeftSubtitle tx={tx} eventsCount={eventsCount} />}
            />
            {eventsCount > 0 ? (
              <AccordionButton
                flexGrow={0}
                flexShrink={0}
                width={8}
                ml={'auto'}
                p={0}
                justifyContent={'center'}
              >
                <AccordionIcon />
              </AccordionButton>
            ) : null}
          </Flex>
          <AccordionPanel p={0}>
            {isExpanded && <TxEvents address={address} txId={tx.tx_id} />}
          </AccordionPanel>
        </>
      )}
    </AccordionItem>
  );
};
