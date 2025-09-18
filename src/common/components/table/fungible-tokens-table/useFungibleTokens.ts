import { THIRTY_SECONDS } from '@/common/queries/query-stale-time';
import { useAccountBalance } from '@/common/queries/useAccountBalance';
import { useFungibleTokensMetadata } from '@/common/queries/useFtMetadata';
import { isRiskyToken } from '@/common/utils/fungible-token-utils';
import { getAssetNameParts } from '@/common/utils/utils';
import { FtMetadataResponse } from '@hirosystems/token-metadata-api-client';
// TOOD: This type is horribly out of date
import { UseQueryOptions } from '@tanstack/react-query';
import { useMemo } from 'react';

import { FtBalance } from '@stacks/stacks-blockchain-api-types';

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

function removeUndefinedFromBalances(
  balances: Record<string, FtBalance | undefined>
): Record<string, FtBalance> {
  const newBalances: Record<string, FtBalance> = {};
  Object.entries(balances).forEach(([key, value]) => {
    if (value) {
      newBalances[key] = value;
    }
  });
  return newBalances;
}

function convertBalancesToArrayWithAssetId(
  balances: Record<string, FtBalance>
): (FtBalance & { asset_identifier: string })[] {
  return Object.entries(balances).map(([assetId, ftBalance]) => {
    return {
      ...ftBalance,
      asset_identifier: assetId,
    };
  });
}

function paginateBalances(balances: FtBalanceWithAssetId[], limit: number, offset: number) {
  return balances.slice(offset, offset + limit);
}

function removeZeroBalanceData(balances: Record<string, FtBalance>): Record<string, FtBalance> {
  const filtered: Record<string, FtBalance> = {};
  Object.entries(balances).forEach(([assetId, ftBalance]) => {
    if (parseFloat(ftBalance?.balance || '0') > 0) {
      filtered[assetId] = ftBalance;
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

const formatBalances = (
  balances: Record<string, FtBalance | undefined>,
  limit: number,
  offset: number,
  searchTerm: string,
  hideSuspiciousTokens: boolean
): FtBalanceWithAssetId[] => {
  return paginateBalances(
    convertBalancesToArrayWithAssetId(
      removeZeroBalanceData(
        filterBalances(removeUndefinedFromBalances(balances), searchTerm, hideSuspiciousTokens)
      )
    ),
    limit,
    offset
  );
};

export function useFungibleTokensTableData(
  principal: string,
  limit: number,
  offset: number,
  searchTerm?: string | undefined,
  hideSuspiciousTokens?: boolean | undefined,
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
