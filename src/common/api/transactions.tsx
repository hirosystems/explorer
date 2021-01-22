// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
// This will be refactored
import { Transaction } from '@models/transaction.interface';
import { fetchFromSidecar } from '@common/api/fetch';
import { MempoolTransaction, TransactionType } from '@blockstack/stacks-blockchain-api-types';
import {
  MempoolTransactionListResponse,
  SmartContractTransaction,
  TransactionResults,
} from '@blockstack/stacks-blockchain-sidecar-types';
import { generateTypesQueryString } from '@common/api/utils';
import { fetchContract } from '@common/api/contracts';
import { ContractDeployTxs, TxData } from '@common/types/tx';
import { makeKey } from '@common/hooks/use-fetch-blocks';

export type FetchTxResponse = Transaction | MempoolTransaction | { error: string };

interface FetchTxListOptions {
  apiServer: string;
  types?: TransactionType[];
  offset?: number;
  limit?: number;
  mempool?: boolean;
}

export type FetchTransactionResponse =
  | TxData<Transaction | MempoolTransaction>
  | { error?: string };

export const fetchTx = (apiServer: string) => async (
  txid: Transaction['tx_id']
): Promise<FetchTxResponse> => {
  const resp = await fetchFromSidecar(apiServer)(`/tx/${txid}`);
  const tx = await resp.json();
  return tx as Transaction | MempoolTransaction | { error: string };
};

export const fetchTxList = (options: FetchTxListOptions) => async (): Promise<
  TransactionResults | MempoolTransactionListResponse
> => {
  const { apiServer, types, offset, limit = 200, mempool } = options;

  const resp = await fetchFromSidecar(apiServer)(
    `/tx${mempool ? '/mempool' : ''}?limit=${limit}${
      offset ? `&offset=${offset}` : ''
    }${generateTypesQueryString(types)}`
  );
  return resp.json();
};

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
      transaction: transaction as any,
    };
  } else {
    const transaction = await fetchTx(apiServer)(query);
    if ('error' in transaction) {
      return {
        error: transaction.error,
      };
    }
    if (transaction.tx_type === 'smart_contract') {
      if (transaction.tx_status === 'pending') {
        return {
          transaction,
        };
      }
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
      transaction: transaction as any,
    };
  }
};

export const fetchPendingTxs = (apiServer: string) => async ({
  query,
  type,
  limit,
}: {
  query: string;
  type: 'principal' | 'tx_id';
  limit?: number;
}) => {
  const path = makeKey({
    type: 'tx',
    limit: limit || 30,
    pending: true,
    index: 0,
    apiServer,
  });

  const res = await fetch(path);
  const mempool: MempoolTransactionListResponse = await res.json();

  if (type === 'principal') {
    const pendingTransactions =
      mempool?.results?.filter(
        (tx: MempoolTransaction) =>
          ((tx.tx_type === 'smart_contract' ||
            tx.tx_type === 'contract_call' ||
            tx.tx_type === 'token_transfer') &&
            tx.sender_address === query) ||
          (tx.tx_type === 'token_transfer' && tx.token_transfer.recipient_address === query) ||
          (tx.tx_type === 'contract_call' && tx.contract_call.contract_id === query)
      ) || [];

    return pendingTransactions;
  } else {
    return mempool?.results?.find(
      (tx: MempoolTransaction) => tx.tx_id === query
    ) as MempoolTransaction;
  }
};
