import type { Transaction } from '@blockstack/stacks-blockchain-api-types';

export enum TransactionType {
  SMART_CONTRACT = 'smart_contract',
  CONTRACT_CALL = 'contract_call',
  TOKEN_TRANSFER = 'token_transfer',
  COINBASE = 'coinbase',
  POISON_MICROBLOCK = 'poison_microblock',
}

export type { Transaction };
