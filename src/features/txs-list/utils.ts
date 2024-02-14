import { TransactionType } from '@stacks/stacks-blockchain-api-types';

export const getTransactionTypeLabel = (value: TransactionType) => {
  switch (value) {
    case 'token_transfer':
      return 'Token transfer';
    case 'coinbase':
      return 'Coinbase';
    case 'contract_call':
      return 'Function call';
    case 'smart_contract':
      return 'Contract deploy';
    case 'poison_microblock':
      return 'Poison microblock';
    case 'tenure_change':
      return 'Tenure change';
  }
};
