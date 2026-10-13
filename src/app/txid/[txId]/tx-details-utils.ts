import { TransactionStatus } from '@/common/constants/constants';
import { TxStatus } from '@/common/types/tx';
import {
  ConfirmedTxDetails,
  TxDetails,
  TxDetailsIncludeField,
  TxEvent,
} from '@/common/types/tx-v3';
import { getContractName, microToStacksFormatted } from '@/common/utils/utils';

/** Heavy v3 transaction fields the transaction page renders; the API omits them unless asked. */
export const TX_DETAILS_INCLUDE: readonly TxDetailsIncludeField[] = [
  'function_args',
  'post_conditions',
  'result',
];

export function isConfirmedTxDetails(tx: TxDetails): tx is ConfirmedTxDetails {
  return 'block' in tx;
}

/**
 * Maps a v3 status onto the explorer's status buckets. v3 only returns canonical mined transactions,
 * so a transaction is never non-canonical here.
 */
export function getTxDetailsStatus(tx: TxDetails): TxStatus {
  switch (tx.status) {
    case 'success':
      return TransactionStatus.SUCCESS_ANCHOR_BLOCK;
    case 'abort_by_response':
    case 'abort_by_post_condition':
    case 'problematic_skipped':
      return TransactionStatus.FAILED;
    case 'pending':
      return TransactionStatus.PENDING;
    default:
      return tx.status.startsWith('dropped_')
        ? TransactionStatus.DROPPED
        : TransactionStatus.PENDING;
  }
}

/** The Stacks block's time, falling back to its Bitcoin block's time for blocks without one. */
export function getTxBlockTime(tx: ConfirmedTxDetails): number {
  return tx.block.time || tx.bitcoin_block.time;
}

export function getTxDetailsTitle(tx: TxDetails): string {
  switch (tx.type) {
    case 'smart_contract':
      return getContractName(tx.smart_contract.contract_id);
    case 'contract_call':
      return tx.contract_call.function_name;
    case 'token_transfer':
      if (isConfirmedTxDetails(tx) && tx.block.height === 1) {
        return 'Stacks 2.0 genesis transfer';
      }
      return `Send ${microToStacksFormatted(tx.token_transfer.amount)} STX`;
    case 'coinbase':
      return isConfirmedTxDetails(tx) ? `Block #${tx.block.height}` : 'Coinbase';
    case 'poison_microblock':
      return 'Poison microblock transaction';
    case 'tenure_change':
      return isConfirmedTxDetails(tx)
        ? `Tenure ${tx.tenure_change.cause} (#${tx.block.height})`
        : 'Tenure change';
  }
}

export function getTxDetailsToAddress(tx: TxDetails): string {
  switch (tx.type) {
    case 'token_transfer':
      return tx.token_transfer.recipient;
    case 'smart_contract':
      return tx.smart_contract.contract_id;
    case 'contract_call':
      return tx.contract_call.contract_id;
    default:
      return '';
  }
}

export type TxAssetEvent = Extract<TxEvent, { type: 'stx_asset' | 'ft_asset' | 'nft_asset' }>;

export interface TxAssetEventDetails {
  assetEventType: 'transfer' | 'mint' | 'burn';
  sender?: string;
  recipient?: string;
  /** Amount in base units; absent for NFTs. */
  amount?: string;
  /** Asset identifier of an FT or NFT; absent for STX. */
  assetIdentifier?: string;
}

export function isTxAssetEvent(event: TxEvent): event is TxAssetEvent {
  return event.type === 'stx_asset' || event.type === 'ft_asset' || event.type === 'nft_asset';
}

/**
 * Flattens the v3 asset event shapes: each of `stx_asset`, `ft_asset` and `nft_asset` is a
 * transfer/mint/burn union that omits the parties a mint or burn doesn't have.
 */
export function getTxAssetEventDetails(event: TxEvent): TxAssetEventDetails | undefined {
  const asset =
    event.type === 'stx_asset'
      ? event.stx_asset
      : event.type === 'ft_asset'
        ? event.ft_asset
        : event.type === 'nft_asset'
          ? event.nft_asset
          : undefined;
  if (!asset) return undefined;
  return {
    assetEventType: asset.type,
    sender: 'sender' in asset ? asset.sender : undefined,
    recipient: 'recipient' in asset ? asset.recipient : undefined,
    amount: 'amount' in asset ? asset.amount : undefined,
    assetIdentifier: 'asset_identifier' in asset ? asset.asset_identifier : undefined,
  };
}
