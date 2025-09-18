import { THIRTY_SECONDS } from '@/common/queries/query-stale-time';
import { useAccountBalance } from '@/common/queries/useAccountBalance';
import { useFungibleTokensMetadata } from '@/common/queries/useFtMetadata';
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

function removeZeroBalanceData(balances: FtBalanceWithAssetId[]): FtBalanceWithAssetId[] {
  return balances.filter(ftBalance => parseFloat(ftBalance?.balance || '0') > 0);
}

function formatBalances(
  balances: Record<string, FtBalance | undefined>,
  limit: number,
  offset: number
): FtBalanceWithAssetId[] {
  return removeZeroBalanceData(
    paginateBalances(
      convertBalancesToArrayWithAssetId(removeUndefinedFromBalances(balances)),
      limit,
      offset
    )
  );
}

function filterBalancesBySearchTerm(balances: FtBalanceWithAssetId[], searchTerm: string) {
  return balances.filter(ftBalance => {
    const { name, ticker } = ftBalance;
    return name?.toLowerCase().includes(searchTerm.toLowerCase()) || ticker?.toLowerCase().includes(searchTerm.toLowerCase());
  });
}

function filterBalancesBySuspiciousTokens(balances: FtBalanceWithAssetId[], hideSuspiciousTokens: boolean) {
  return balances.filter(ftBalance => {
    const { name, ticker } = ftBalance;
    return name?.toLowerCase().includes(searchTerm.toLowerCase()) || ticker?.toLowerCase().includes(searchTerm.toLowerCase());
  });
}

export function useFungibleTokensTableData(
  principal: string,
  limit: number,
  offset: number,
  searchTerm?: string,
  hideSuspiciousTokens?: boolean,
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
  const filteredBalances = useMemo(() => {
    if (!balances) return [];
    return Object.entries(balances.fungible_tokens || {}).filter(([_, ftBalance]) => {
      return ftBalance.balance !== '0';
    });
  }, [balances]);
  // format balances. memoize to prevent inconsistent pagination
  const formattedBalances = useMemo(
    () => formatBalances(balances?.fungible_tokens || {}, limit, offset),
    [balances, limit, offset]
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
    total: fungibleTokenWithMetadata.length,
  };
}
