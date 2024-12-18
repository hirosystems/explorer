'use client';

import { FtBasicMetadataResponse } from '@hirosystems/token-metadata-api-client';
import { useCallback, useMemo } from 'react';

import {
  useInfiniteQueryResult,
  useSuspenseInfiniteQueryResult,
} from '../../common/hooks/useInfiniteQueryResult';
import { useFtTokens, useSuspenseFtTokens } from '../../common/queries/useFtTokens';
import { sbtcContractAddress } from '../token/[tokenId]/consts';

export const useSuspenseTokens = (
  debouncedSearchTerm: string
): {
  allFtTokensDeduped: FtBasicMetadataResponse[];
  isLoading: boolean;
  hasMore: boolean;
  loadMore: () => void;
} => {
  const searchByNameResponse = useSuspenseFtTokens({ name: debouncedSearchTerm || undefined });

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

  const shouldAddSbtc = useMemo(() => !debouncedSearchTerm, [debouncedSearchTerm]); // Only add sBTC if no search term is provided. If sbtc is searched, it will be added by default. If a search term that is not sbtc is provided, sbtc should not be added.
  const sbtcResponse = useFtTokens({ address: sbtcContractAddress }, { enabled: shouldAddSbtc });

  const ftTokensSearchedByName =
    useSuspenseInfiniteQueryResult<FtBasicMetadataResponse>(searchByNameResponse);
  const ftTokensSearchedBySymbol =
    useInfiniteQueryResult<FtBasicMetadataResponse>(searchBySymbolResponse);
  const ftTokensSearchedByAddress =
    useInfiniteQueryResult<FtBasicMetadataResponse>(searchByAddressResponse);
  const sbtc = useInfiniteQueryResult<FtBasicMetadataResponse>(sbtcResponse);

  const allFtTokensDeduped = useMemo(() => {
    const allFtTokens = [
      ...ftTokensSearchedByName,
      ...ftTokensSearchedBySymbol,
      ...ftTokensSearchedByAddress,
      ...(shouldAddSbtc ? sbtc : []),
    ];
    const uniqueFtTokens = new Map<string, FtBasicMetadataResponse>();
    allFtTokens.forEach(ftToken => {
      uniqueFtTokens.set(ftToken.tx_id, ftToken);
    });
    return Array.from(uniqueFtTokens.values()).sort((a, b) => {
      // First check for sBTC
      if (shouldAddSbtc) {
        if (a.tx_id === sbtc[0]?.tx_id) return -1;
        if (b.tx_id === sbtc[0]?.tx_id) return 1;
      }
      // Then do alphabetical comparison
      return (a.name ?? '').localeCompare(b.name ?? '');
    });
  }, [
    ftTokensSearchedByAddress,
    ftTokensSearchedByName,
    ftTokensSearchedBySymbol,
    sbtc,
    shouldAddSbtc,
  ]);

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

  return { allFtTokensDeduped, isLoading, hasMore, loadMore };
};
