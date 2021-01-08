import type { SearchResult } from '@common/types/search';
import { SearchResultType } from '@common/types/search';
import { fetchFromSidecar } from '@common/api/fetch';
import { fetchAllAccountData } from '@common/api/accounts';
import { fetchBlock } from '@common/api/blocks';
import { fetchTransaction } from '@common/api/transactions';

export function makeKey(query: string | null, prefix: string): string | null {
  return query !== null ? `${prefix}__${query}` : null;
}
export function extractQueryFromKey(query: string | null, prefix: string): string | null {
  return query ? query.replace(`${prefix}__`, '') : null;
}

export const fetchSearchResults = (apiServer: string) => async (query: string) => {
  const res = await fetchFromSidecar(apiServer)(`/search/${query}`);
  return res.json() as Promise<SearchResult>;
};

export const getFetcher = async (
  ...args: [query: string, type: SearchResultType, apiServer: string]
) => {
  const [query, type, apiServer] = args;
  switch (type) {
    case SearchResultType.StandardAddress: {
      const data = await fetchAllAccountData(apiServer)(query, 1);
      return {
        principal: query,
        entity_id: query,
        ...data,
      };
    }
    case SearchResultType.BlockHash: {
      const data = await fetchBlock(apiServer)(query);
      return {
        ...data,
        entity_id: query,
      };
    }
    case SearchResultType.ContractAddress:
    case SearchResultType.MempoolTxId:
    case SearchResultType.TxId: {
      const data = await fetchTransaction(apiServer)(query);
      return {
        ...data,
        entity_id: query,
      };
    }
    default:
      return () => null;
  }
};
