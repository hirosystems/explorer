import { useDebounce } from '../../common/hooks/useDebounce';
import { useSearchQuery } from '../../common/queries/useSearchQuery';
import { useAppSelector } from '../../common/state/hooks';
import { selectSearchTerm } from './search-slice';

export const useSearch = () => {
  const searchTerm = useAppSelector(selectSearchTerm);
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const id = searchTerm ? debouncedSearchTerm : '';
  return {
    query: useSearchQuery(id),
    searchTerm,
  };
};
