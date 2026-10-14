import { TxEvent } from '@/common/types/tx-v3';
import { getTxAssetEventDetails } from '@/common/utils/tx-details-utils';
import TransferIcon from '@/ui/icons/TransferIcon';
import { Fire, Lock, Question, Sparkle, TextAlignLeft } from '@phosphor-icons/react';

export function getFromAddress(event: TxEvent): string {
  if (event.type === 'stx_lock') {
    return event.stx_lock.address;
  }
  return getTxAssetEventDetails(event)?.sender ?? '';
}

export function getAmount(event: TxEvent): string {
  if (event.type === 'nft_asset') {
    return '1';
  }
  if (event.type === 'stx_lock') {
    return event.stx_lock.amount;
  }
  return getTxAssetEventDetails(event)?.amount ?? '';
}

export function getToAddress(event: TxEvent): string {
  return getTxAssetEventDetails(event)?.recipient ?? '';
}

export function getAssetType(event: TxEvent): string {
  switch (event.type) {
    case 'contract_log':
      return 'Contract log';
    case 'stx_lock':
      return 'STX lock';
    case 'stx_asset':
      return 'STX token';
    case 'ft_asset':
      return 'Fungible token';
    case 'nft_asset':
      return 'Non fungible token';
  }
}

export type ExtendedTransactionEventAssetType =
  | 'transfer'
  | 'mint'
  | 'burn'
  | 'stx_lock'
  | 'print'
  | 'unknown';

export function getAssetEventType(event: TxEvent): ExtendedTransactionEventAssetType {
  if (event.type === 'contract_log') {
    return event.contract_log.topic;
  }
  if (event.type === 'stx_lock') {
    return 'stx_lock';
  }
  return getTxAssetEventDetails(event)?.assetEventType ?? 'unknown';
}

export function getAssetEventTypeLabel(assetEventType: ExtendedTransactionEventAssetType): string {
  if (assetEventType === 'mint') {
    return 'Mint';
  }
  if (assetEventType === 'burn') {
    return 'Burn';
  }
  if (assetEventType === 'transfer') {
    return 'Transfer';
  }
  if (assetEventType === 'stx_lock') {
    return 'STX lock';
  }
  if (assetEventType === 'print') {
    return 'Print';
  }
  return 'Unknown';
}

export function getAssetEventTypeIcon(
  assetEventType: ExtendedTransactionEventAssetType
): React.ReactNode {
  if (assetEventType === 'mint') {
    return <Sparkle />;
  }
  if (assetEventType === 'burn') {
    return <Fire />;
  }
  if (assetEventType === 'transfer') {
    return <TransferIcon />;
  }
  if (assetEventType === 'stx_lock') {
    return <Lock />;
  }
  if (assetEventType === 'print') {
    return <TextAlignLeft />;
  }
  return <Question />;
}

export function getAsset(event: TxEvent): string {
  if (event.type === 'contract_log') {
    return ''; // could be the contract id
  }
  if (event.type === 'stx_asset' || event.type === 'stx_lock') {
    return 'STX';
  }
  return getTxAssetEventDetails(event)?.assetIdentifier ?? '';
}

export function getContractLogPrintValue(event: TxEvent):
  | {
      hex: string;
      repr: string;
    }
  | undefined {
  if (event.type === 'contract_log') {
    return event.contract_log.value;
  }
  return undefined;
}
