import React from 'react';
import {
  TransactionEvent,
  TransactionEventAssetType,
  TransactionType,
} from '@stacks/stacks-blockchain-api-types';
import { BurnIcon, MintIcon, TransferIcon } from '@components/svg';
import { color } from '@stacks/ui';

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

export const getTransactionTypeLabel = (value: TransactionType) => {
  switch (value) {
    case 'token_transfer':
      return 'STX transfer';
    case 'coinbase':
      return 'Coinbase';
    case 'contract_call':
      return 'Function call';
    case 'smart_contract':
      return 'Contract deploy';
    case 'poison_microblock':
      return 'Poison microblock';
  }
};

export const getAssetEventTypeLabel = (value?: TransactionEventAssetType) => {
  switch (value) {
    case 'transfer':
      return {
        label: 'Transfer',
        icon: TransferIcon,
        bg: color('accent'),
      };
    case 'mint':
      return {
        label: 'Mint',
        icon: MintIcon,
        bg: color('feedback-success'),
      };
    case 'burn':
      return {
        label: 'Burn',
        icon: BurnIcon,
        bg: color('feedback-error'),
      };
    default:
      return {
        label: undefined,
        icon: undefined,
      };
  }
};
