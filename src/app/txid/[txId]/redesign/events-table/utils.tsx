import TransferIcon from '@/ui/icons/TransferIcon';
import { Fire, Question, Sparkle } from '@phosphor-icons/react';

import { TransactionEvent, TransactionEventAssetType } from '@stacks/stacks-blockchain-api-types';

const EMPTY_VALUE = '-';

export function getFromAddress(event: TransactionEvent): string {
  if (event.event_type === 'stx_asset') {
    return event.asset.sender ?? EMPTY_VALUE;
  }

  return 'uncovered case';
}

export function getAmount(event: TransactionEvent): number {
  if (event.event_type === 'stx_asset') {
    return Number(event.asset.amount);
  }
  return 0;
}

export function getToAddress(event: TransactionEvent): string {
  if (event.event_type === 'stx_asset') {
    return event.asset.recipient ?? EMPTY_VALUE;
  }

  return 'uncovered case';
}

export function getAsset(event: TransactionEvent): string {
  if (event.event_type === 'stx_asset') {
    return event.event_type;
  }

  return 'uncovered case';
}

export function getEventType(event: TransactionEvent): TransactionEvent['event_type'] {
  if (event.event_type) {
    return event.event_type;
  }

  return EMPTY_VALUE as TransactionEvent['event_type'];
}

export function getAssetEventType(event: TransactionEvent): TransactionEventAssetType {
  if ('asset' in event && event.asset.asset_event_type) {
    return event.asset.asset_event_type as TransactionEventAssetType;
  }

  return EMPTY_VALUE as TransactionEventAssetType;
}

export function getEventTypeColValue(event: TransactionEvent): string {
  if (event.event_type) {
    return event.event_type;
  }

  return EMPTY_VALUE;
}

export function getAssetEventTypeIcon(assetEventType: TransactionEventAssetType): React.ReactNode {
  if (assetEventType === 'mint') {
    return <Sparkle />;
  }
  // if (assetEventType === 'print') { // TODO: does this even exist?
  //   return <TextAlignLeft />;
  // }
  if (assetEventType === 'burn') {
    return <Fire />;
  }
  if (assetEventType === 'transfer') {
    return <TransferIcon />;
  }
  return <Question />;
}

export function getAssetEventTypeLabel(assetEventType: TransactionEventAssetType): string {
  if (assetEventType === 'mint') {
    return 'Mint';
  }
  if (assetEventType === 'burn') {
    return 'Burn';
  }
  if (assetEventType === 'transfer') {
    return 'Transfer';
  }
  return 'Unknown';
}

export function getEventTypeLabel(eventType: TransactionEvent['event_type']): string {
  if (eventType === 'stx_asset') {
    return 'STX';
  }
  if (eventType === 'fungible_token_asset') {
    return 'Fungible token';
  }
  if (eventType === 'non_fungible_token_asset') {
    return 'Non-fungible token';
  }
  return 'Unknown';
}

export function getAssetLabel(asset: string): string {
  if (asset === 'stx_asset') {
    return 'STX';
  }
  return asset;
}
