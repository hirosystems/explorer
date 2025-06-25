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
  if (event.event_type === 'stx_asset') {
    return (
      (event.asset.asset_event_type as TransactionEvent['event_type']) ??
      (EMPTY_VALUE as TransactionEvent['event_type'])
    );
  }

  return 'uncovered case' as TransactionEvent['event_type'];
}

export function getAssetType(event: TransactionEvent): TransactionEventAssetType {
  if (event.event_type === 'stx_asset') {
    return event.asset.asset_event_type as TransactionEventAssetType;
  }

  return 'uncovered case' as TransactionEventAssetType;
}

export function getEventTypeLabel(eventType: TransactionEvent['event_type']): string {
  if (eventType === 'stx_asset') {
    return 'STX Asset';
  }

  return 'uncovered case';
}