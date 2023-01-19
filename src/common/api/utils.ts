import { Transaction } from '@stacks/stacks-blockchain-api-types';
import { ChainID } from '@stacks/transactions';

import { NetworkMode, NetworkModes } from '@common/types/network';

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

export const getNetworkModeFromNetworkId = (networkId: ChainID): NetworkModes | undefined => {
  switch (networkId) {
    case ChainID.Mainnet:
      return NetworkModes.Mainnet;
    case ChainID.Testnet:
      return NetworkModes.Testnet;
    case ChainID.Devnet:
      return NetworkModes.Devnet;
    default:
      return undefined;
  }
};
