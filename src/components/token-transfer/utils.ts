import { TransactionEvent } from '@blockstack/stacks-blockchain-sidecar-types';
import { AssetType } from '@components/token-transfer/types';

export const getEventTypeName = (value: TransactionEvent['event_type']) => {
  switch (value) {
    case 'stx_asset':
      return 'Stacks Token';
    case 'smart_contract_log':
      return 'Smart Contract';
    case 'fungible_token_asset':
      return 'Fungible Asset';
    case 'non_fungible_token_asset':
      return 'Non-fungible Asset';
  }
};
export const getAssetEventTypeLabel = (value: AssetType['asset_event_type']) => {
  switch (value) {
    case 'transfer':
      return 'Transferred';
    case 'mint':
      return 'Minted';
    case 'burn':
      return 'Burned';
  }
};
