import { Transaction } from '@models/transaction.interface';
import { fetchFromSidecar } from '@common/api/fetch';
import { MempoolTransaction, TransactionType } from '@blockstack/stacks-blockchain-api-types';
import {
  MempoolTransactionListResponse,
  SmartContractTransaction,
  TransactionResults,
} from '@blockstack/stacks-blockchain-sidecar-types';

import { fetchContract } from '@common/api/contracts';
import { ContractDeployTxs, NonContractTxs, TxData } from '@common/types/tx';

export type FetchTxResponse = Transaction | MempoolTransaction | { error: string };

export const fetchTx = (apiServer: string) => async (
  txid: Transaction['tx_id']
): Promise<FetchTxResponse> => {
  const resp = await fetchFromSidecar(apiServer)(`/tx/${txid}`);
  const tx = await resp.json();
  return tx as Transaction | MempoolTransaction | { error: string };
};

interface FetchTxListOptions {
  apiServer: string;
  types?: TransactionType[];
  offset?: number;
  limit?: number;
  mempool?: boolean;
}

export const fetchTxList = (options: FetchTxListOptions) => async (): Promise<
  TransactionResults | MempoolTransactionListResponse
> => {
  const { apiServer, types, offset, limit = 200, mempool } = options;
  const generateTypesQueryString = () => {
    if (types?.length) {
      return `&${types
        .map(type => `${encodeURIComponent('type[]')}=${encodeURIComponent(type)}`)
        .join('&')}`;
    }
    return '';
  };
  const resp = await fetchFromSidecar(apiServer)(
    `/tx${mempool ? '/mempool' : ''}?limit=${limit}${
      offset ? '&offset=' + offset : ''
    }${generateTypesQueryString()}`
  );
  return resp.json();
};
export type FetchTransactionResponse =
  | TxData<Transaction | MempoolTransaction>
  | { error?: string };

export const fetchTransaction = (apiServer: string) => async (
  query: string
): Promise<FetchTransactionResponse> => {
  if (query.includes('.')) {
    const contract = await fetchContract(apiServer)(query);
    if ('error' in contract) {
      return {
        error: contract.error,
      };
    }
    const transaction = await fetchTx(apiServer)(contract.tx_id);
    if ('error' in transaction) {
      return {
        error: transaction.error,
      };
    }
    return {
      contract,
      transaction: transaction as SmartContractTransaction,
    };
  } else {
    const transaction = await fetchTx(apiServer)(query);
    if ('error' in transaction) {
      return {
        error: transaction.error,
      };
    }
    if (transaction.tx_type === 'smart_contract') {
      const contract = await fetchContract(apiServer)(transaction.smart_contract.contract_id);
      if ('error' in contract) {
        return {
          error: contract.error,
        };
      }
      return {
        transaction,
        contract,
      };
    }
    if (transaction.tx_type === 'contract_call') {
      const contract = await fetchContract(apiServer)(transaction.contract_call.contract_id);

      if ('error' in contract) {
        return {
          error: contract.error,
        };
      }
      const contractTransaction = await fetchTx(apiServer)(contract.tx_id);
      if ('error' in contractTransaction) {
        return {
          error: contractTransaction.error,
        };
      }
      return {
        transaction,
        source: {
          contract,
          transaction: contractTransaction as ContractDeployTxs,
        },
      };
    }
    return {
      transaction,
    };
  }
};
