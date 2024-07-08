import { useQuery } from '@tanstack/react-query';

import {
  GetTransactionListOrderEnum,
  GetTransactionListSortByEnum,
} from '@stacks/blockchain-api-client';
import { Block } from '@stacks/stacks-blockchain-api-types';
import { bufferCVFromString, cvToHex, tupleCV, validateStacksAddress } from '@stacks/transactions';

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

type AdvancedSearchKeywords = 'from:' | 'to:' | 'before:' | 'after:';
type AdvancedSearchConfig = Record<
  AdvancedSearchKeywords,
  { filter: string; isValid: (value: string) => boolean; transform: (value: string) => any }
>;

export const advancedSearchConfig: AdvancedSearchConfig = {
  'from:': {
    filter: 'fromAddress',
    isValid: validateStacksAddress,
    transform: (value: string) => value,
  },
  'to:': {
    filter: 'toAddress',
    isValid: validateStacksAddress,
    transform: (value: string) => value,
  },
  'before:': {
    filter: 'endTime',
    isValid: (date: string) => /^\d{4}-\d{2}-\d{2}$/.test(date) && !!Date.parse(date),
    transform: (value: string) => Date.parse(value) / 1000,
  },
  'after:': {
    filter: 'startTime',
    isValid: (date: string) => /^\d{4}-\d{2}-\d{2}$/.test(date) && !!Date.parse(date),
    transform: (value: string) => Date.parse(value) / 1000,
  },
};

export function parseAdvancedSearchQuery(id: string) {
  const query: Record<string, string> = {};
  const isAdvancedSearch = Object.keys(advancedSearchConfig).some(term => id.includes(term));
  if (!isAdvancedSearch) return query;
  Object.entries(advancedSearchConfig).forEach(([key, config]) => {
    const index = id.indexOf(key);
    if (index !== -1) {
      const value = id.slice(index + key.length).split(' ')[0];
      if (!config.isValid(value)) return;
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
    queryKey: ['search', id],
    queryFn: async () => {
      let foundResult;
      let notFoundResult;
      if (isAdvancedSearch) {
        const txsResponse = await api.transactionsApi.getTransactionList({
          limit: 3,
          offset: 0,
          unanchored: true,
          sortBy: GetTransactionListSortByEnum.burn_block_time,
          order: GetTransactionListOrderEnum.desc,
          ...advancedSearchQuery,
        });
        const txs = txsResponse?.results || [];
        foundResult = {
          found: true,
          result: {
            entity_id: id,
            entity_type: SearchResultType.TxList,
            txs,
          },
        };
      } else if (isBtcName) {
        try {
          const nftHistory = await nonFungibleTokensApi.getNftHistory({
            assetIdentifier: BTC_BNS_CONTRACT,
            value: cvToHex(
              tupleCV({
                ['name']: bufferCVFromString(id.replace(new RegExp('.btc$'), '')),
                ['namespace']: bufferCVFromString('btc'),
              })
            ),
          });
          if (nftHistory.results.length) {
            foundResult = nftHistoryToSearchResult(nftHistory.results[0], id);
          }
        } catch (e) {}
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
          foundResult = await searchApi.searchById({ id, includeMetadata: true });
        } catch (e: any) {
          try {
            const data = await e.json();
            if (data && 'found' in data) {
              notFoundResult = data;
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
