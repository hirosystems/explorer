import { UTCDate } from '@date-fns/utc';
import { useQuery } from '@tanstack/react-query';

import {
  GetTransactionListOrderEnum,
  GetTransactionListSortByEnum,
} from '@stacks/blockchain-api-client';
import { Block, Transaction } from '@stacks/stacks-blockchain-api-types';
import { bufferCVFromString, cvToHex, tupleCV } from '@stacks/transactions';

import { blur, focus } from '../../features/search/search-slice';
import { useApi } from '../api/useApi';
import { BTC_BNS_CONTRACT } from '../constants/constants';
import { useAppDispatch } from '../state/hooks';
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

export type AdvancedSearchKeywords = 'FROM:' | 'TO:' | 'BEFORE:' | 'AFTER:' | 'TERM:';

type AdvancedSearchConfig = Record<
  string,
  { filter: string; type: string; transform: (value: string) => any; build: (value: any) => string }
>;

export function getKeywordByFilter(keyword: string) {
  switch (keyword) {
    case 'fromAddress':
      return 'FROM:';
    case 'toAddress':
      return 'TO:';
    case 'endTime':
      return 'BEFORE:';
    case 'startTime':
      return 'AFTER:';
    default:
      return '';
  }
}

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
    build: (value: string) => value,
  },
  'TO:': {
    filter: 'toAddress',
    type: 'address',
    transform: (value: string) => value,
    build: (value: string) => value,
  },
  'BEFORE:': {
    filter: 'endTime',
    type: 'YYYY-MM-DD',
    transform: (value: string) => {
      const [year, month, day] = value.split('-').map(Number);
      const utcDate = new UTCDate(year, month - 1, day, 23, 59, 59);
      return Math.floor(utcDate.getTime() / 1000);
    },
    build: (value: number) => {
      const date = new Date(value * 1000);
      const year = date.getUTCFullYear();
      const month = String(date.getUTCMonth() + 1).padStart(2, '0');
      const day = String(date.getUTCDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
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
    build: (value: number) => {
      const date = new Date(value * 1000);
      const year = date.getUTCFullYear();
      const month = String(date.getUTCMonth() + 1).padStart(2, '0');
      const day = String(date.getUTCDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    },
  },
  'TERM:': {
    filter: 'term',
    type: 'string',
    transform: (value: string) => value,
    build: (value: string) => value,
  },
};

export const advancedSearchKeywords: string[] = Object.keys(
  advancedSearchConfig
) as AdvancedSearchKeywords[];

const splitRegex = new RegExp(`/ +/|(${advancedSearchKeywords.join('|')})`);

export function parseAdvancedSearchQuery(id: string) {
  const query: { filterName: string; filterValue: string }[] = [];
  const isAdvancedSearch = advancedSearchKeywords.some(term => id.includes(term));
  if (!isAdvancedSearch) return query;
  const startsWithTerm = !advancedSearchKeywords.some(term => id.startsWith(term));
  if (startsWithTerm) {
    const term = id.split(splitRegex)[0].trim();
    query.push({ filterName: 'term', filterValue: term });
  }
  Object.entries(advancedSearchConfig).forEach(([key, config]) => {
    const index = id.indexOf(key);
    if (index !== -1) {
      const [filterValue, ...termValue] = id
        .slice(index + key.length)
        .split(splitRegex)[0]
        .trim()
        .split(' ');
      query.push({ filterName: config.filter, filterValue: config.transform(filterValue) });
      if (termValue.length) {
        query.push({ filterName: 'term', filterValue: termValue.join(' ') });
      }
    }
  });
  return query;
}

export function buildAdvancedSearchQuery(query: Record<string, string | number | null>): string {
  let searchTerm = '';
  Object.entries(query).forEach(([filter, value]) => {
    if (!value) return;
    const keyword = getKeywordByFilter(filter);
    if (!keyword) {
      // term
      searchTerm += `${value} `;
    } else {
      const config = advancedSearchConfig[keyword];
      const transformedValue = config.build(value as string | number);
      searchTerm += `${keyword}${transformedValue} `;
    }
  });
  return searchTerm.trim();
}

export function getSearchPageUrl(searchTerm: string) {
  const advancedSearchQuery = parseAdvancedSearchQuery(searchTerm);
  const searchQueryParams = new URLSearchParams();
  let termCount = 0;
  advancedSearchQuery.forEach(({ filterName, filterValue }) => {
    if (filterName === 'term') {
      searchQueryParams.append(`${filterName}_${++termCount}`, filterValue);
    } else {
      searchQueryParams.append(filterName, filterValue);
    }
  });
  return `/search?${searchQueryParams.toString()}`;
}

export function useSearchQuery(id: string) {
  const dispatch = useAppDispatch();
  const { searchApi, blocksApi, nonFungibleTokensApi } = useApi();
  const isBtcName = id.endsWith('.btc');
  const advancedSearchQuery = parseAdvancedSearchQuery(id);
  const isAdvancedSearch = advancedSearchQuery.length > 0;
  const api = useApi();
  return useQuery({
    queryKey: ['search', isAdvancedSearch ? JSON.stringify(advancedSearchQuery) : id],
    queryFn: async () => {
      let foundResult: FoundResult | undefined = undefined;
      let notFoundResult: NotFoundResult | undefined = undefined;
      if (isAdvancedSearch) {
        const hasTerm = advancedSearchQuery.some(({ filterName }) => filterName === 'term');
        if (hasTerm) {
          // not supported, return no results
          notFoundResult = {
            found: false,
            result: {
              entity_type: SearchResultType.InvalidTerm,
            },
            error: 'Not supported',
          };
          return notFoundResult;
        }
        const fromFilter = advancedSearchQuery.find(
          ({ filterName }) => filterName === 'fromAddress'
        );
        const toFilter = advancedSearchQuery.find(({ filterName }) => filterName === 'toAddress');
        if (fromFilter?.filterValue?.endsWith('.btc')) {
          fromFilter.filterValue =
            (await searchByBnsName(api, fromFilter.filterValue))?.result.entity_id ||
            fromFilter.filterValue;
        }
        if (toFilter?.filterValue?.endsWith('.btc')) {
          toFilter.filterValue =
            (await searchByBnsName(api, toFilter.filterValue))?.result.entity_id ||
            toFilter.filterValue;
        }
        const fromAddress = advancedSearchQuery.find(
          ({ filterName }) => filterName === 'fromAddress'
        )?.filterValue;
        const toAddress = advancedSearchQuery.find(({ filterName }) => filterName === 'toAddress')
          ?.filterValue;
        const startTime = advancedSearchQuery.find(({ filterName }) => filterName === 'startTime')
          ?.filterValue;
        const endTime = advancedSearchQuery.find(({ filterName }) => filterName === 'endTime')
          ?.filterValue;
        const term = advancedSearchQuery
          .filter(({ filterName }) => filterName === 'term')
          .reduce((acc, { filterValue }) => acc + filterValue + ' ', '')
          .trim();
        // TODO: use term when it's supported
        const txsResponse = await api.transactionsApi.getTransactionList({
          limit: 5,
          offset: 0,
          unanchored: true,
          sortBy: GetTransactionListSortByEnum.burn_block_time,
          order: GetTransactionListOrderEnum.desc,
          ...(fromAddress && { fromAddress: fromAddress }),
          ...(toAddress && { toAddress: toAddress }),
          ...(startTime && { startTime: Number(startTime) }),
          ...(endTime && { endTime: Number(endTime) }),
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
        if (foundResult.result.entity_type !== SearchResultType.TxList) {
          // single result, blur and go to entity page directly
          dispatch(blur());
        } else {
          dispatch(focus());
        }
        return foundResult as FoundResult;
      } else if (notFoundResult) {
        dispatch(focus());
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
