import { useAtomValue } from 'jotai/utils';
import { apiClientsState } from '@store/api-clients';
import {
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

export const useSearchQuery = (id: string) => {
  const { searchApi, blocksApi } = useAtomValue(apiClientsState);
  return useQuery(
    ['search', id],
    async () => {
      let foundResult;
      let notFoundResult;

      if (isNumeric(id)) {
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
