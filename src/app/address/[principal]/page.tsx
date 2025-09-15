import { getTokenPrice } from '@/app/getTokenPriceInfo';
import { CommonSearchParams } from '@/app/transactions/page';
import { DEFAULT_MAINNET_SERVER, DEFAULT_TESTNET_SERVER } from '@/common/constants/env';
import { NetworkModes } from '@/common/types/network';
import { logError } from '@/common/utils/error-utils';
import { getApiUrl } from '@/common/utils/network-utils';

import {
  AddressBalanceResponse,
  AddressNonces,
  BnsNamesOwnByAddressResponse,
} from '@stacks/stacks-blockchain-api-types';

import { AddressIdPageDataProvider } from './AddressIdPageContext';
import AddressPage from './PageClient';
import { fetchAddressBNSNames, fetchAddressBalances, fetchAddressLatestNonce } from './page-data';

export default async function Page(props: {
  params: Promise<{ principal: string }>;
  searchParams: Promise<CommonSearchParams>;
}) {
  const { params } = props;
  const searchParams = await props.searchParams;
  const { principal } = await params;
  const chain = (searchParams.chain as NetworkModes) || NetworkModes.Mainnet;
  const api =
    searchParams.api || chain === NetworkModes.Mainnet
      ? DEFAULT_MAINNET_SERVER
      : DEFAULT_TESTNET_SERVER;
  const apiUrl = getApiUrl(chain, api);
  let tokenPrice = {
    stxPrice: 0,
    btcPrice: 0,
  };
  let initialAddressBalancesData: AddressBalanceResponse | undefined;
  let initialAddressLatestNonceData: AddressNonces | undefined;
  let initialAddressBNSNamesData: BnsNamesOwnByAddressResponse | undefined;
  try {
    tokenPrice = await getTokenPrice();
    initialAddressBalancesData = await fetchAddressBalances(apiUrl, principal);
    initialAddressLatestNonceData = await fetchAddressLatestNonce(apiUrl, principal);
    initialAddressBNSNamesData = await fetchAddressBNSNames(apiUrl, principal);
  } catch (error) {
    logError(
      error as Error,
      'Address Id page server-side fetch for initial data',
      { principal, tokenPrice, initialAddressBalancesData, chain, api },
      'error'
    );
  }
  return (
    <AddressIdPageDataProvider
      stxPrice={tokenPrice.stxPrice}
      btcPrice={tokenPrice.btcPrice}
      initialAddressBalancesData={initialAddressBalancesData}
      initialAddressLatestNonceData={initialAddressLatestNonceData}
      initialAddressBNSNamesData={initialAddressBNSNamesData}
      principal={principal}
    >
      <AddressPage principal={principal} />
    </AddressIdPageDataProvider>
  );
}
