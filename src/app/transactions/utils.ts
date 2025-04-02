import {
  CoinbaseTransaction,
  ContractCallTransaction,
  MempoolTransaction,
  SmartContractTransaction,
  TenureChangeTransaction,
  TokenTransferTransaction,
  Transaction,
} from '@stacks/stacks-blockchain-api-types';

export type CompressedTxTableData = Pick<
  Transaction,
  | 'tx_id'
  | 'tx_type'
  | 'tx_status'
  | 'block_height'
  | 'fee_rate'
  | 'block_time'
  | 'block_height'
  | 'sender_address'
> & {
  token_transfer?: Pick<
    NonNullable<TokenTransferTransaction['token_transfer']>,
    'amount' | 'recipient_address'
  >;
  smart_contract?: Pick<NonNullable<SmartContractTransaction['smart_contract']>, 'contract_id'>;
  contract_call?: Pick<
    NonNullable<ContractCallTransaction['contract_call']>,
    'contract_id' | 'function_name'
  >;
  coinbase_payload?: Pick<NonNullable<CoinbaseTransaction['coinbase_payload']>, 'alt_recipient'>;
  tenure_change_payload?: Pick<
    NonNullable<TenureChangeTransaction['tenure_change_payload']>,
    'cause'
  >;
};

export function compressTransactions(transactions: Transaction[]): CompressedTxTableData[] {
  return transactions.map(tx => {
    const minimalTx: CompressedTxTableData = {
      tx_id: tx.tx_id,
      tx_type: tx.tx_type,
      tx_status: tx.tx_status,
      block_height: tx.block_height,
      fee_rate: tx.fee_rate,
      block_time: tx.block_time,
      sender_address: tx.sender_address,
    };

    if ('token_transfer' in tx && tx.token_transfer) {
      minimalTx.token_transfer = {
        amount: tx.token_transfer.amount,
        recipient_address: tx.token_transfer.recipient_address,
      };
    }

    if ('smart_contract' in tx && tx.smart_contract) {
      minimalTx.smart_contract = {
        contract_id: tx.smart_contract.contract_id,
      };
    }

    if ('contract_call' in tx && tx.contract_call) {
      minimalTx.contract_call = {
        contract_id: tx.contract_call.contract_id,
        function_name: tx.contract_call.function_name,
      };
    }

    if ('coinbase_payload' in tx && tx.coinbase_payload) {
      minimalTx.coinbase_payload = {
        alt_recipient: tx.coinbase_payload.alt_recipient,
      };
    }

    if ('tenure_change_payload' in tx && tx.tenure_change_payload) {
      minimalTx.tenure_change_payload = {
        cause: tx.tenure_change_payload.cause,
      };
    }

    return minimalTx;
  });
}

export function getToAddress(tx: Transaction | MempoolTransaction): string {
  if (tx.tx_type === 'token_transfer') {
    return tx.token_transfer?.recipient_address;
  }
  if (tx.tx_type === 'smart_contract') {
    return tx.smart_contract?.contract_id;
  }
  if (tx.tx_type === 'contract_call') {
    return tx.contract_call?.contract_id;
  }
  if (tx.tx_type === 'coinbase') {
    return tx.coinbase_payload?.alt_recipient ?? '';
  }
  if (tx.tx_type === 'tenure_change') {
    return '';
  }
  return '';
}

export function getAmount(tx: Transaction): number {
  if (tx.tx_type === 'token_transfer') {
    return Number(tx.token_transfer?.amount);
  }
  return 0;
}
