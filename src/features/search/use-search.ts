import { useAtomValue } from 'jotai/utils';
import { apiClientsState } from '@store/api-clients';
import { FoundResult, NotFoundResult } from '@common/types/search-results';
import { useQuery } from 'react-query';
import { useAppSelector } from '@common/state/hooks';
import { selectSearchTerm } from '@features/search/search-slice';
import { useDebounce } from '@common/hooks/use-debounce';

export const useSearchQuery = (id: string) => {
  const { searchApi } = useAtomValue(apiClientsState);
  return useQuery(
    ['search', id],
    async () => {
      try {
        const result = await searchApi.searchById({ id });
        return result as FoundResult;
      } catch (e) {
        try {
          const data = await e.json();
          if (data && 'found' in data) return data as NotFoundResult;
        } catch (e) {
          return undefined;
        }
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
