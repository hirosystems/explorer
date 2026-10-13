import { SBTC_DECIMALS, getSbtcAssetId } from '@/app/token/[tokenId]/consts';
import { AddressLink, TokenLink } from '@/common/components/ExplorerLinks';
import { useSbtcNetworkMode } from '@/common/hooks/useSbtcNetworkMode';
import { useFtMetadata } from '@/common/queries/useFtMetadata';
import { TxEvent } from '@/common/types/tx-v3';
import { ftDecimals, getAssetNameParts, truncateMiddle } from '@/common/utils/utils';
import { Flex, Text } from '@chakra-ui/react';
import { FC } from 'react';

import { TxAssetEvent, getTxAssetEventDetails, isTxAssetEvent } from '../../tx-details-utils';

interface TokenTransferItemProps {
  event: TxAssetEvent;
}

export const TokenTransferItem: FC<TokenTransferItemProps> = ({ event }) => {
  const networkMode = useSbtcNetworkMode();
  const isStx = event.type === 'stx_asset';
  const isFt = event.type === 'ft_asset';
  const isNft = event.type === 'nft_asset';
  const {
    sender,
    recipient,
    amount: rawAmount,
    assetIdentifier,
  } = getTxAssetEventDetails(event) ?? {};

  const ftAssetId = isFt ? assetIdentifier : undefined;
  const ftAssetParts = ftAssetId ? getAssetNameParts(ftAssetId) : undefined;
  const ftContractId = ftAssetParts
    ? `${ftAssetParts.address}.${ftAssetParts.contract}`
    : undefined;
  const isSbtc = ftAssetId === getSbtcAssetId(networkMode);

  const { data: ftMetadata } = useFtMetadata(ftContractId, { enabled: isFt && !isSbtc });

  let contractId = '';
  let symbol = 'STX';
  let amount = '1';

  if (isStx) {
    amount = ftDecimals(rawAmount || '0', 6);
  } else if (isFt) {
    contractId = ftContractId!;
    symbol = ftAssetParts!.asset;
    const decimals = isSbtc ? SBTC_DECIMALS : ftMetadata?.decimals;
    amount = ftDecimals(rawAmount || '0', decimals ?? 0);
  } else if (isNft) {
    const { asset, address, contract } = getAssetNameParts(assetIdentifier || '');
    contractId = `${address}.${contract}`;
    symbol = asset;
    amount = '1';
  }

  return (
    <Flex gap={1} flexWrap="wrap" alignItems="center">
      {sender && (
        <>
          <Text textStyle="text-regular-sm">From:</Text>
          <AddressLink address={sender} variant="tableLink">
            {truncateMiddle(sender, 4, 5)}
          </AddressLink>
          <Text textStyle="text-regular-sm">→</Text>
        </>
      )}
      <Text textStyle="text-regular-sm">To:</Text>
      <AddressLink address={recipient || ''} variant="tableLink">
        {truncateMiddle(recipient || '', 4, 5)}
      </AddressLink>
      <Text textStyle="text-regular-sm">For:</Text>
      <Text textStyle="text-regular-sm" fontWeight="medium">
        {amount}
      </Text>
      {isStx || isNft ? (
        <Text textStyle="text-regular-sm">{symbol}</Text>
      ) : (
        <TokenLink tokenId={contractId} variant="tableLink">
          {symbol}
        </TokenLink>
      )}
    </Flex>
  );
};

interface TokensTransferredProps {
  events: TxEvent[];
}

export function getTransferEvents(events: TxEvent[]): TxAssetEvent[] {
  return events.filter(
    (event): event is TxAssetEvent =>
      isTxAssetEvent(event) && getTxAssetEventDetails(event)?.assetEventType === 'transfer'
  );
}

export const TokensTransferred: FC<TokensTransferredProps> = ({ events }) => {
  const transferEvents = getTransferEvents(events);

  if (transferEvents.length === 0) {
    return (
      <Text textStyle="text-regular-sm" color="textSecondary">
        -
      </Text>
    );
  }

  return (
    <Flex direction="column" gap={2}>
      {transferEvents.map((event, index) => (
        <TokenTransferItem key={`${event.event_index}-${index}`} event={event} />
      ))}
    </Flex>
  );
};
