import { useAtomValue } from 'jotai/utils';
import { apiClientsState } from '@store/api-clients';
import {
  AddressSearchResult,
  BlockSearchResult,
  FoundResult,
  NotFoundResult,
  SearchResultType,
} from '@common/types/search-results';
import { useQuery } from 'react-query';
import { useAppSelector } from '@common/state/hooks';
import { selectSearchTerm } from '@features/search/search-slice';
import { useDebounce } from '@common/hooks/use-debounce';
import { isNumeric } from '@common/utils';
import { Block } from '@stacks/blockchain-api-client';
import { BTC_BNS_CONTRACT } from '@common/constants';
import { cvToHex, tupleCV, bufferCVFromString } from '@stacks/transactions';

export const useSearchQuery = (id: string) => {
  const { searchApi, blocksApi, nonFungibleTokensApi } = useAtomValue(apiClientsState);
  const isBtcName = id.endsWith('.btc');
  return useQuery(
    ['search', id],
    async () => {
      let foundResult;
      let notFoundResult;

      if (isBtcName) {
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
            foundResult = nftHistoryToSearchResult(
              nftHistory.results[nftHistory.results.length - 1],
              id
            );
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
          foundResult = await searchApi.searchById({ id });
        } catch (e) {
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
        return undefined;
      }
    },
    {
      enabled: !!id,
      retry: false,
      refetchOnWindowFocus: false,
      staleTime: 1 * 60 * 1000,
    }
  );
};

export const useSearch = () => {
  const searchTerm = useAppSelector(selectSearchTerm);
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const id = searchTerm ? debouncedSearchTerm : '';
  return {
    query: useSearchQuery(id),
    searchTerm,
  };
};

function blockToSearchResult(block: Block): FoundResult {
  const blockResult: BlockSearchResult = {
    entity_id: block.hash,
    entity_type: SearchResultType.BlockHash,
    block_data: {
      canonical: block.canonical,
      hash: block.hash,
      parent_block_hash: block.parent_block_hash,
      burn_block_time: block.burn_block_time,
      height: block.height,
    },
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
