import { ChainID } from '@stacks/transactions';
import { Network, NetworkModes } from '@common/types/network';
import {
  DEFAULT_MAINNET_SERVER,
  DEFAULT_TESTNET_SERVER,
  DEFAULT_DEVNET_SERVER,
} from '@common/constants';

export const NetworkIdModeMap: { [key in ChainID]: NetworkModes } = {
  [ChainID.Mainnet]: NetworkModes.Mainnet,
  [ChainID.Testnet]: NetworkModes.Testnet,
};

export const NetworkModeUrlMap: Record<NetworkModes, string> = {
  [NetworkModes.Mainnet]: DEFAULT_MAINNET_SERVER,
  [NetworkModes.Testnet]: DEFAULT_TESTNET_SERVER,
};

export const DEFAULT_NETWORK_MAP: Record<string, Network> = {
  [DEFAULT_MAINNET_SERVER]: {
    //TODO: use different key
    label: 'stacks.co',
    url: DEFAULT_MAINNET_SERVER,
    networkId: ChainID.Mainnet,
    mode: NetworkModes.Mainnet,
  },
  [DEFAULT_TESTNET_SERVER]: {
    label: 'stacks.co',
    url: DEFAULT_TESTNET_SERVER,
    networkId: ChainID.Testnet,
    mode: NetworkModes.Testnet,
  },
  [DEFAULT_DEVNET_SERVER]: {
    label: 'devnet',
    url: DEFAULT_DEVNET_SERVER,
    networkId: ChainID.Testnet,
    mode: NetworkModes.Testnet,
  },
};

export const DEFAULT_NETWORK_LIST = Object.values(DEFAULT_NETWORK_MAP);
