import { TableContainer } from '@/common/components/table/TableContainer';
import { TablePaginationControls } from '@/common/components/table/TablePaginationControls';
import {
  convertBalancesToArrayWithAssetId,
  paginateBalances,
  removeUndefinedFromBalances,
  removeZeroBalanceData,
} from '@/common/components/table/fungible-tokens-table/useFungibleTokens';
import { useGlobalContext } from '@/common/context/useGlobalContext';
import { useSuspenseNftHoldings } from '@/common/queries/useNftHoldings';
import { Box, Grid } from '@chakra-ui/react';
import { NftMetadataResponse } from '@hirosystems/token-metadata-api-client';
import { PaginationState } from '@tanstack/react-table';
import { useCallback, useState } from 'react';

import { NftBalance } from '@stacks/stacks-blockchain-api-types';
import { cvToJSON, hexToCV } from '@stacks/transactions';

import { useAddressIdPageData } from '../AddressIdPageContext';
import { useBnsNames } from '../TokenBalanceCard/useBnsNames';
import { CollectibleCard } from './CollectibleCard';

const ITEMS_PER_PAGE = 5;

export type NftBalanceWithAssetId = NftBalance & { asset_identifier: string };

type NftData = NftMetadataResponse & NftBalanceWithAssetId;

const emptyNftBalance: NftBalanceWithAssetId = {
  count: '',
  total_sent: '',
  total_received: '',
  asset_identifier: '',
};

const emptyMetadata: NftMetadataResponse = {
  token_uri: undefined,
  metadata: undefined,
};

const emptyNftData: NftData = {
  ...emptyNftBalance,
  ...emptyMetadata,
};

function useFormattedNFTBalances(
  nftBalances: Record<string, NftBalance | undefined>,
  limit: number,
  offset: number
) {
  console.log('nftBalances', nftBalances);
  const definedNftBalances = removeUndefinedFromBalances<NftBalance>(nftBalances || {});
  console.log('definedNftBalances', definedNftBalances);
  const positiveNftBalances = removeZeroBalanceData<NftBalance>(definedNftBalances);
  console.log('positiveNftBalances', positiveNftBalances);
  const nftBalancesArray = convertBalancesToArrayWithAssetId<NftBalance>(positiveNftBalances);
  console.log('nftBalancesArray', nftBalancesArray);
  const paginatedBalances = paginateBalances<NftBalanceWithAssetId>(
    nftBalancesArray,
    limit,
    offset
  );
  console.log('paginatedBalances', paginatedBalances);
  return paginatedBalances;
}

export function NFTTable() {
  const { principal, initialAddressBalancesData } = useAddressIdPageData();

  const { data: nftHoldings } = useSuspenseNftHoldings(principal);
  const { activeNetwork } = useGlobalContext();
  const { bnsNames } = useBnsNames(nftHoldings, activeNetwork.mode);

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: ITEMS_PER_PAGE,
  });

  const handlePageChange = useCallback((page: PaginationState) => {
    setPagination(prev => ({
      ...prev,
      pageIndex: page.pageIndex,
    }));
    window?.scrollTo(0, 0); // Smooth scroll to top
  }, []);

  const formattedBalances = useFormattedNFTBalances(
    initialAddressBalancesData?.non_fungible_tokens || {},
    pagination.pageSize,
    pagination.pageIndex * pagination.pageSize
  );

  console.log('NftTable', { formattedBalances, nftHoldings });

  // const nftTokenIds = formattedBalances.map(nftBalance => {
  //   const { address, contract } = getAssetNameParts(nftBalance.asset_identifier);
  //   return `${address}.${contract}`;
  // });

  // const { data: nftMetadata } = useNftsMetadata(nftTokenIds, {
  //   staleTime: THIRTY_SECONDS,
  //   gcTime: THIRTY_SECONDS,
  // });

  return (
    <Box>
      <TableContainer>
        <Grid templateColumns="repeat(auto-fill, minmax( 1fr))" gap={4} p={4}>
          {formattedBalances.map(item => {
            const holdings = nftHoldings?.results.filter(
              nftHolding => nftHolding.asset_identifier === item.asset_identifier
            )[0];
            console.log({ assetIdentifier: item.asset_identifier, holdings, nftHoldings });
            const hex = holdings?.value.hex;
            const cv = hexToCV(hex);
            console.log({ cv });
            const json = cvToJSON(cv);
            console.log({ json });
            const value = json.value;
            console.log({ value });
            const firstNftValue = BigInt(value);
            console.log({ firstNftValue });
            return (
              <CollectibleCard
                key={item.asset_identifier}
                assetId={item.asset_identifier}
                tokenId={firstNftValue}
                {...item}
              />
            );
          })}
        </Grid>
      </TableContainer>
      <TablePaginationControls
        pageIndex={pagination.pageIndex}
        pageSize={pagination.pageSize}
        totalRows={Object.keys(initialAddressBalancesData?.non_fungible_tokens || {}).length}
        onPageChange={handlePageChange}
      />
    </Box>
  );
}
