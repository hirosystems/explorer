import { Transaction } from '@models/transaction.interface';
import { fetchFromSidecar } from '@common/api/fetch';
import { TransactionType } from '@blockstack/stacks-blockchain-api-types';
import {
  MempoolTransactionListResponse,
  TransactionResults,
} from '@blockstack/stacks-blockchain-sidecar-types';

export const fetchTx = (apiServer: string): ((txid: string) => Promise<Transaction>) => async (
  txid: Transaction['tx_id']
): Promise<Transaction> => {
  const resp = await fetchFromSidecar(apiServer)(`/tx/${txid}`);

  const tx = await resp.json();
  if (!resp.ok) {
    throw Error(tx.error);
  }

  return tx;
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
