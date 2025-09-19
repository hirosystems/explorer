import { THIRTY_SECONDS } from '@/common/queries/query-stale-time';
import { useAccountBalance } from '@/common/queries/useAccountBalance';
import { useFungibleTokensMetadata } from '@/common/queries/useFtMetadata';
import { isRiskyToken } from '@/common/utils/fungible-token-utils';
import { getAssetNameParts } from '@/common/utils/utils';
import { FtMetadataResponse } from '@hirosystems/token-metadata-api-client';
// TOOD: This type is horribly out of date
import { UseQueryOptions } from '@tanstack/react-query';
import { useMemo } from 'react';

import { FtBalance, NftBalance } from '@stacks/stacks-blockchain-api-types';
import { NftBalanceWithAssetId } from '@/app/address/[principal]/redesign/NFTTable';

type FtBalanceWithAssetId = FtBalance & { asset_identifier: string };

type FungibleTokenWithMetadata = FtMetadataResponse & FtBalanceWithAssetId;

const emptyFtBalance: FtBalanceWithAssetId = {
  balance: '',
  total_sent: '',
  total_received: '',
  asset_identifier: '',
};

const emptyMetadata: FtMetadataResponse = {
  name: undefined,
  symbol: undefined,
  decimals: undefined,
  total_supply: undefined,
  token_uri: undefined,
  description: undefined,
  image_uri: undefined,
  image_canonical_uri: undefined,
  tx_id: '',
  sender_address: '',
  metadata: undefined,
};

const emptyFungibleTokenWithMetadata: FungibleTokenWithMetadata = {
  ...emptyFtBalance,
  ...emptyMetadata,
};

export function removeUndefinedFromBalances<T extends FtBalance | NftBalance>(
  balances: Record<string, T | undefined>
): Record<string, T> {
  const newBalances: Record<string, T> = {};
  Object.entries(balances).forEach(([key, value]) => {
    if (value) {
      newBalances[key] = value;
    }
  });
  return newBalances;
}

export function convertBalancesToArrayWithAssetId<T extends FtBalance | NftBalance>(
  balances: Record<string, T>
): (T & { asset_identifier: string })[] {
  return Object.entries(balances).map(([assetId, balance]) => {
    return {
      ...balance,
      asset_identifier: assetId,
    };
  });
}

export function paginateBalances<T extends FtBalanceWithAssetId | NftBalanceWithAssetId>(balances: T[], limit: number, offset: number) {
  return balances.slice(offset, offset + limit);
}

export function removeZeroBalanceData<T extends FtBalance | NftBalance>(
  balances: Record<string, T>
): Record<string, T> {
  const filtered: Record<string, T> = {};
  Object.entries(balances).forEach(([assetId, balance]) => {
    const balanceOrCount = 'balance' in balance ? balance.balance : balance.count;
    if (parseFloat(balanceOrCount || '0') > 0) {
      filtered[assetId] = balance;
    }
  });
  return filtered;
}

function filterBalancesBySearchTerm(
  balances: Record<string, FtBalance>,
  searchTerm: string
): Record<string, FtBalance> {
  if (!searchTerm) return balances;

  const filtered: Record<string, FtBalance> = {};
  Object.entries(balances).forEach(([assetId, ftBalance]) => {
    if (assetId?.toLowerCase().includes(searchTerm.toLowerCase())) {
      filtered[assetId] = ftBalance;
    }
  });
  return filtered;
}

function filterBalancesBySuspiciousTokens(
  balances: Record<string, FtBalance>,
  hideSuspiciousTokens: boolean
): Record<string, FtBalance> {
  if (!hideSuspiciousTokens) return balances;

  const filtered: Record<string, FtBalance> = {};
  Object.entries(balances).forEach(([assetId, ftBalance]) => {
    const { address, contract } = getAssetNameParts(assetId);
    const tokenId = `${address}.${contract}`;
    if (isRiskyToken(tokenId)) return;
    filtered[assetId] = ftBalance;
  });
  return filtered;
}

const filterBalances = (
  balances: Record<string, FtBalance>,
  searchTerm: string,
  hideSuspiciousTokens: boolean
): Record<string, FtBalance> => {
  const filteredBySearchTerm = filterBalancesBySearchTerm(balances, searchTerm);
  const filteredBySuspiciousTokens = filterBalancesBySuspiciousTokens(
    filteredBySearchTerm,
    hideSuspiciousTokens
  );
  return filteredBySuspiciousTokens;
};

const sortBalances = (
  balances: FtBalanceWithAssetId[],
  columnId: string,
  sortDirection: 'asc' | 'desc'
): FtBalanceWithAssetId[] => {
  return balances.sort((a, b) => {
    if (columnId === 'balance') {
      const aValue = parseFloat(a.balance);
      const bValue = parseFloat(b.balance);
      return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
    }
    if (columnId === 'holding') {
      const aValue = parseFloat(a.holding);
      const bValue = parseFloat(b.holding);
      return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
    }
    return 0;
  });
};

const formatBalances = (
  balances: Record<string, FtBalance | undefined>,
  limit: number,
  offset: number,
  searchTerm: string,
  hideSuspiciousTokens: boolean
): FtBalanceWithAssetId[] => {
  return paginateBalances(
    convertBalancesToArrayWithAssetId(
      removeZeroBalanceData<FtBalance>(
        filterBalances(
          removeUndefinedFromBalances<FtBalance>(balances),
          searchTerm,
          hideSuspiciousTokens
        )
      )
    ),
    limit,
    offset
  );
};

// TODO: I should probably split all of this out.
// 1. Fetch the balances
// 2. Sort the balances
// 3. Paginate the balances
// 4. Fetch the metadata
// 5. Merge balances and metadata
// 6. Return the result
export function useFungibleTokensTableData(
  principal: string,
  limit: number,
  offset: number,
  searchTerm?: string | undefined,
  hideSuspiciousTokens?: boolean | undefined,
  sortColumn?: string | undefined,
  sortDirection?: 'asc' | 'desc' | undefined,
  options?: Omit<UseQueryOptions<FtMetadataResponse, Error>, 'queryKey' | 'queryFn'>
) {
  let {
    data: balances,
    isFetching,
    isLoading,
  } = useAccountBalance(principal, {
    staleTime: THIRTY_SECONDS,
    gcTime: THIRTY_SECONDS,
    ...options,
  });
  console.log('useFungibleTokensTableData', { balances });
  const formattedBalances = useMemo(
    () =>
      formatBalances(
        balances?.fungible_tokens || {},
        limit,
        offset,
        searchTerm || '',
        hideSuspiciousTokens || false
      ),
    [balances?.fungible_tokens, limit, offset, searchTerm, hideSuspiciousTokens]
  );

  // extract token ids from the formatted balances
  const tokenIds = formattedBalances.map(ftBalance => {
    const { address, contract } = getAssetNameParts(ftBalance.asset_identifier);
    return `${address}.${contract}`;
  });

  // fetch metadata using the token ids
  const {
    ftMetadata,
    isLoading: isLoadingMetadata,
    isFetching: isFetchingMetadata,
  } = useFungibleTokensMetadata(tokenIds, options);

  // the final data object
  const fungibleTokenWithMetadata: FungibleTokenWithMetadata[] = [];

  // First, add all balance data
  formattedBalances.forEach(ftBalance => {
    fungibleTokenWithMetadata.push({
      ...emptyFungibleTokenWithMetadata, // start with empty metadata
      ...ftBalance,
    });
  });

  // Then, merge metadata for matching tokens
  ftMetadata.forEach((ft, index) => {
    if (!ft) return;
    const assetId = 'asset_identifier' in ft ? (ft.asset_identifier as string) : '';
    if (!assetId) return;
    const metadata = fungibleTokenWithMetadata.find(ft => ft.asset_identifier === assetId);
    if (metadata) {
      fungibleTokenWithMetadata[index] = {
        ...metadata,
        ...ft,
      };
    }
  });

  return {
    data: fungibleTokenWithMetadata,
    isLoading: isLoading || isLoadingMetadata,
    isFetching: isFetching || isFetchingMetadata,
    total: Object.keys(balances?.fungible_tokens || {}).length,
  };
}
