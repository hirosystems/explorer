import { NetworkModes } from '@/common/types/network';

import { Transaction } from '@stacks/stacks-blockchain-api-types';
import { ChainID } from '@stacks/transactions';

export const constructLimitAndOffsetQueryParams = (limit: number, offset?: number): string =>
  `limit=${limit}${offset ? `&offset=${offset}` : ''}`;

export const generateTypesQueryString = (types?: Transaction['tx_type'][]) => {
  if (types?.length) {
    return `&${types
      .map(type => `${encodeURIComponent('type[]')}=${encodeURIComponent(type)}`)
      .join('&')}`;
  }
  return '';
};

export const getNetworkModeFromNetworkId = (networkId: ChainID) => {
  switch (networkId) {
    case ChainID.Mainnet:
      return NetworkModes.Mainnet;
    case ChainID.Testnet:
      return NetworkModes.Testnet;
    default:
      return undefined;
  }
};
