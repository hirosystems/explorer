import { UTCDate } from '@date-fns/utc';
import { useQuery } from '@tanstack/react-query';

import {
  GetTransactionListOrderEnum,
  GetTransactionListSortByEnum,
} from '@stacks/blockchain-api-client';
import { Block, Transaction } from '@stacks/stacks-blockchain-api-types';
import { bufferCVFromString, cvToHex, tupleCV } from '@stacks/transactions';

import { useApi } from '../api/useApi';
import { BTC_BNS_CONTRACT } from '../constants/constants';
import {
  AddressSearchResult,
  BlockSearchResult,
  FoundResult,
  NotFoundResult,
  SearchResultType,
} from '../types/search-results';
import { isNumeric } from '../utils/utils';

function blockToSearchResult(block: Block): FoundResult {
  const blockResult: BlockSearchResult = {
    entity_id: block.hash,
    entity_type: SearchResultType.BlockHash,
    block_data: block,
    tx_count: block.txs?.length || 0,
  };
  return {
    found: true,
    result: blockResult,
  };
}

function nftHistoryToSearchResult(nftHistoryEntry: any, bnsName: string): FoundResult {
  const blockResult: AddressSearchResult = {
    entity_id: nftHistoryEntry.recipient,
    entity_type: SearchResultType.StandardAddress,
    display_name: bnsName,
  };
  return {
    found: true,
    result: blockResult,
  };
}

export async function searchByBnsName(api: ReturnType<typeof useApi>, bnsName: string) {
  try {
    const nftHistory = await api.nonFungibleTokensApi.getNftHistory({
      assetIdentifier: BTC_BNS_CONTRACT,
      value: cvToHex(
        tupleCV({
          ['name']: bufferCVFromString(bnsName.replace(new RegExp('.btc$'), '')),
          ['namespace']: bufferCVFromString('btc'),
        })
      ),
    });
    if (nftHistory.results.length) {
      return nftHistoryToSearchResult(nftHistory.results[0], bnsName);
    }
  } catch (e) {}
}

export type AdvancedSearchKeywords = 'FROM:' | 'TO:' | 'BEFORE:' | 'AFTER:';

type AdvancedSearchConfig = Record<
  string,
  { filter: string; type: string; transform: (value: string) => any }
>;

export const filterToKeywordMap: Record<string, AdvancedSearchKeywords> = {
  fromAddress: 'FROM:',
  toAddress: 'TO:',
  endTime: 'BEFORE:',
  startTime: 'AFTER:',
};

export function formatTimestamp(value: string) {
  const utcDate = new UTCDate(Number(value) * 1000);
  const month = utcDate.getUTCMonth();
  const day = utcDate.getUTCDate();
  const year = utcDate.getUTCFullYear();
  if (isNaN(month) || isNaN(day) || isNaN(year)) return 'invalid date';
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

export const filterToFormattedValueMap: Record<string, (value: string) => string> = {
  fromAddress: (value: string) => value,
  toAddress: (value: string) => value,
  endTime: formatTimestamp,
  startTime: formatTimestamp,
};

export const advancedSearchConfig: AdvancedSearchConfig = {
  'FROM:': {
    filter: 'fromAddress',
    type: 'address',
    transform: (value: string) => value,
  },
  'TO:': {
    filter: 'toAddress',
    type: 'address',
    transform: (value: string) => value,
  },
  'BEFORE:': {
    filter: 'endTime',
    type: 'YYYY-MM-DD',
    transform: (value: string) => {
      const [year, month, day] = value.split('-').map(Number);
      const utcDate = new UTCDate(year, month - 1, day, 23, 59, 59);
      return Math.floor(utcDate.getTime() / 1000);
    },
  },
  'AFTER:': {
    filter: 'startTime',
    type: 'YYYY-MM-DD',
    transform: (value: string) => {
      const [year, month, day] = value.split('-').map(Number);
      const utcDate = new UTCDate(year, month - 1, day, 0, 0, 0);
      return Math.floor(utcDate.getTime() / 1000);
    },
  },
};

export const advancedSearchKeywords: string[] = Object.keys(
  advancedSearchConfig
) as AdvancedSearchKeywords[];

const splitRegex = new RegExp(`/ +/|(${advancedSearchKeywords.join('|')})`);

export function parseAdvancedSearchQuery(id: string) {
  const query: Record<string, string> = {};
  const isAdvancedSearch = advancedSearchKeywords.some(term => id.includes(term));
  if (!isAdvancedSearch) return query;
  Object.entries(advancedSearchConfig).forEach(([key, config]) => {
    const index = id.indexOf(key);
    if (index !== -1) {
      const value = id
        .slice(index + key.length)
        .split(splitRegex)[0]
        .trim();
      query[config.filter] = config.transform(value);
    }
  });
  return query;
}

export function useSearchQuery(id: string) {
  const { searchApi, blocksApi, nonFungibleTokensApi } = useApi();
  const isBtcName = id.endsWith('.btc');
  const advancedSearchQuery = parseAdvancedSearchQuery(id);
  const isAdvancedSearch = Object.keys(advancedSearchQuery).length > 0;
  const api = useApi();
  return useQuery({
    queryKey: ['search', isAdvancedSearch ? JSON.stringify(advancedSearchQuery) : id],
    queryFn: async () => {
      let foundResult: FoundResult | undefined = undefined;
      let notFoundResult: NotFoundResult | undefined = undefined;
      if (isAdvancedSearch) {
        if (advancedSearchQuery.fromAddress?.endsWith('.btc')) {
          advancedSearchQuery.fromAddress =
            (await searchByBnsName(api, advancedSearchQuery.fromAddress))?.result.entity_id ||
            advancedSearchQuery.fromAddress;
        }
        if (advancedSearchQuery.toAddress?.endsWith('.btc')) {
          advancedSearchQuery.toAddress =
            (await searchByBnsName(api, advancedSearchQuery.toAddress))?.result.entity_id ||
            advancedSearchQuery.toAddress;
        }
        const txsResponse = await api.transactionsApi.getTransactionList({
          limit: 5,
          offset: 0,
          unanchored: true,
          sortBy: GetTransactionListSortByEnum.burn_block_time,
          order: GetTransactionListOrderEnum.desc,
          ...advancedSearchQuery,
        });
        const txs = (txsResponse?.results as Transaction[]) || ([] as Transaction[]);
        foundResult = {
          found: true,
          result: {
            entity_id: id,
            entity_type: SearchResultType.TxList,
            txs,
            metadata: {
              totalCount: txsResponse.total,
            },
          },
        };
      } else if (isBtcName) {
        foundResult = await searchByBnsName(api, id);
      } else if (isNumeric(id)) {
        // Fetch block height if numeric
        try {
          const block = await blocksApi.getBlockByHeight({ height: parseInt(id) });
          if (block) {
            foundResult = blockToSearchResult(block);
          }
        } catch (e) {}
      } else {
        try {
          foundResult = (await searchApi.searchById({ id, includeMetadata: true })) as FoundResult; // TODO: The API needs to add the type
        } catch (e: any) {
          try {
            const data = await e.json();
            if (data && 'found' in data) {
              // An address for which the API doesn't have data is still a valid address that can be shown on the explorer
              if (
                (data as NotFoundResult).result?.entity_type === SearchResultType.StandardAddress &&
                data.found === false
              ) {
                foundResult = {
                  found: true,
                  result: {
                    entity_type: SearchResultType.StandardAddress,
                    entity_id: id,
                  },
                };
              } else {
                notFoundResult = data;
              }
            }
          } catch (e) {}
        }
      }

      if (foundResult) {
        return foundResult as FoundResult;
      } else if (notFoundResult) {
        return notFoundResult as NotFoundResult;
      } else {
        return null;
      }
    },
    enabled: !!id,
    retry: false,
    refetchOnWindowFocus: false,
    staleTime: 1 * 60 * 1000,
  });
}
