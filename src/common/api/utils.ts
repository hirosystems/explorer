'use client';

import { ChainID } from '@stacks/transactions';

import { NetworkModes } from '../types/network';

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
