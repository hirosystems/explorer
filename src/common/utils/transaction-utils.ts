import { MempoolTransaction, Transaction } from '@stacks/stacks-blockchain-api-types';

export function getToAddress(tx: Transaction | MempoolTransaction): string {
  switch (tx.tx_type) {
    case 'token_transfer':
      return tx.token_transfer?.recipient_address || '';
    case 'smart_contract':
      return tx.smart_contract?.contract_id || '';
    case 'contract_call':
      return tx.contract_call?.contract_id || '';
    case 'coinbase':
      return '';
    case 'tenure_change':
      return '';
    default:
      return '';
  }
}

export function getAmount(tx: Transaction | MempoolTransaction): number {
  if (tx.tx_type === 'token_transfer') {
    return Number(tx.token_transfer?.amount || '0');
  }
  return 0;
}
