import { stacksAPIFetch } from '@/api/stacksAPIFetch';

import {
  AddressBalanceResponse,
  AddressNonces,
  BnsNamesOwnByAddressResponse,
} from '@stacks/stacks-blockchain-api-types';

export const getAddressBalancesTag = (principal: string) => `address-balances-${principal}`;
export const getAddressLatestNonceTag = (principal: string) => `address-latest-nonce-${principal}`;
export const getAddressBNSNamesTag = (principal: string) => `address-bns-names-${principal}`;
const ADDRESS_BALANCES_REVALIDATION_TIMEOUT_IN_SECONDS = 3; // 3 seconds

export async function fetchAddressBalances(
  apiUrl: string,
  principal: string
): Promise<AddressBalanceResponse> {
  const response = await stacksAPIFetch(`${apiUrl}/extended/v1/address/${principal}/balances`, {
    cache: 'default',
    next: {
      revalidate: ADDRESS_BALANCES_REVALIDATION_TIMEOUT_IN_SECONDS,
      tags: [getAddressBalancesTag(principal)],
    },
  });

  const balanceResponse: AddressBalanceResponse = await response.json();
  return balanceResponse;
}

export async function fetchAddressLatestNonce(
  apiUrl: string,
  principal: string
): Promise<AddressNonces> {
  const response = await stacksAPIFetch(`${apiUrl}/extended/v1/address/${principal}/nonces`, {
    cache: 'default',
    next: {
      revalidate: ADDRESS_BALANCES_REVALIDATION_TIMEOUT_IN_SECONDS,
      tags: [getAddressLatestNonceTag(principal)],
    },
  });

  const nonceResponse: AddressNonces = await response.json();
  return nonceResponse;
}

export async function fetchAddressBNSNames(
  apiUrl: string,
  principal: string
): Promise<BnsNamesOwnByAddressResponse> {
  const response = await stacksAPIFetch(`${apiUrl}/v1/addresses/stacks/${principal}`, {
    cache: 'default',
    next: {
      revalidate: ADDRESS_BALANCES_REVALIDATION_TIMEOUT_IN_SECONDS,
      tags: [getAddressBNSNamesTag(principal)],
    },
  });

  const bnsNamesResponse: BnsNamesOwnByAddressResponse = await response.json();
  return bnsNamesResponse;
}

export async function fetchAddressStackingInfo(
  apiUrl: string,
  principal: string
): Promise<AddressStackingInfo> {
  const response = await stacksAPIFetch(`${apiUrl}/extended/v1/address/${principal}/stacking-info`, {
    cache: 'default',
    next: {
      revalidate: ADDRESS_BALANCES_REVALIDATION_TIMEOUT_IN_SECONDS,
      tags: [getAddressStackingInfoTag(principal)],
    },
  });

  const stackingInfoResponse: AddressStackingInfo = await response.json();
  return stackingInfoResponse;
}