import type { SearchResult } from '@common/types/search';
import { SearchResultType } from '@common/types/search';
import { fetchFromSidecar } from '@common/api/fetch';
import { fetchAllAccountData } from '@common/api/accounts';
import { fetchBlock } from '@common/api/blocks';
import { fetchTransaction } from '@common/api/transactions';
import { getAddressDetails } from '@common/utils/addresses';

export function makeKey(query: string | null, prefix: string): string | null {
  return query !== null ? `${prefix}__${query}` : null;
}

export function extractQueryFromKey(query: string | null, prefix: string): string | null {
  return query ? query.replace(`${prefix}__`, '') : null;
}

export const fetchSearchResults = (apiServer: string) => async (query: string) => {
  const res = await fetchFromSidecar(apiServer)(`/search/${query}`);
  const data = await res.json();
  // this is a workaround for the API not returning data for valid stx addresses
  if (data && data?.found === false && data?.result?.entity_type === 'standard_address') {
    return {
      found: true,
      result: {
        entity_id: query,
        entity_type: 'standard_address',
      },
    };
  }
  return data;
};

export const getFetcher = async (
  ...args: [query: string, type: SearchResultType, apiServer: string]
) => {
  const [query, type, apiServer] = args;
  switch (type) {
    case SearchResultType.StandardAddress: {
      const data = await fetchAllAccountData(apiServer)({
        principal: query,
        txLimit: 1,
      });
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
