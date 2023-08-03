import { useCallback, useMemo, useState } from 'react';
import { useDebounce } from '@/app/common/hooks/use-debounce';
import { useFtTokens } from '@/app/tokens/useFtTokens';
import { useInfiniteQueryResult } from '@/app/common/hooks/useInfiniteQueryResult';
import { FtBasicMetadataResponse } from '@hirosystems/token-metadata-api-client';

export const useTokens = (): {
  searchTerm: string;
  setSearchTerm: (searchTerm: string) => void;
  allFtTokensDeduped: FtBasicMetadataResponse[];
  isLoading: boolean;
  hasMore: boolean;
  loadMore: () => void;
} => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const searchByNameResponse = useFtTokens({ name: debouncedSearchTerm || undefined });

  const searchBySymbol = !!debouncedSearchTerm;
  const searchByAddress = new RegExp('^[0123456789ABCDEFGHJKMNPQRSTVWXYZ]{28,41}').test(
    debouncedSearchTerm
  );

  const searchBySymbolResponse = useFtTokens(
    { symbol: debouncedSearchTerm },
    { enabled: !!searchBySymbol }
  );
  const searchByAddressResponse = useFtTokens(
    { address: debouncedSearchTerm },
    { enabled: searchByAddress }
  );

  const ftTokensSearchedByName =
    useInfiniteQueryResult<FtBasicMetadataResponse>(searchByNameResponse);
  const ftTokensSearchedBySymbol =
    useInfiniteQueryResult<FtBasicMetadataResponse>(searchBySymbolResponse);
  const ftTokensSearchedByAddress =
    useInfiniteQueryResult<FtBasicMetadataResponse>(searchByAddressResponse);

  const allFtTokensDeduped = useMemo(() => {
    const allFtTokens = [
      ...ftTokensSearchedByName,
      ...ftTokensSearchedBySymbol,
      ...ftTokensSearchedByAddress,
    ];
    const uniqueFtTokens = new Map<string, FtBasicMetadataResponse>();
    allFtTokens.forEach(ftToken => {
      uniqueFtTokens.set(ftToken.tx_id, ftToken);
    });
    return Array.from(uniqueFtTokens.values());
  }, [ftTokensSearchedByAddress, ftTokensSearchedByName, ftTokensSearchedBySymbol]);

  const loadMore = useCallback(() => {
    void searchByNameResponse.fetchNextPage();
    if (searchBySymbol) {
      void searchBySymbolResponse.fetchNextPage();
    }
    if (searchByAddress) {
      void searchByAddressResponse.fetchNextPage();
    }
  }, [
    searchByAddress,
    searchByAddressResponse,
    searchByNameResponse,
    searchBySymbol,
    searchBySymbolResponse,
  ]);

  const hasMore = useMemo(() => {
    return !!(
      searchByNameResponse.hasNextPage ||
      (searchBySymbol && searchBySymbolResponse.hasNextPage) ||
      (searchByAddress && searchByAddressResponse.hasNextPage)
    );
  }, [
    searchByAddress,
    searchByAddressResponse.hasNextPage,
    searchByNameResponse.hasNextPage,
    searchBySymbol,
    searchBySymbolResponse.hasNextPage,
  ]);

  const isLoading = useMemo(() => {
    return (
      searchByNameResponse.isFetching ||
      (searchBySymbol && searchBySymbolResponse.isFetching) ||
      (searchByAddress && searchByAddressResponse.isFetching)
    );
  }, [
    searchByAddress,
    searchByAddressResponse.isFetching,
    searchByNameResponse.isFetching,
    searchBySymbol,
    searchBySymbolResponse.isFetching,
  ]);

  return { searchTerm, setSearchTerm, allFtTokensDeduped, isLoading, hasMore, loadMore };
};
