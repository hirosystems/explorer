import { ChainID } from '@stacks/transactions';

import { Network, NetworkModes } from '../types/network';
import { DEFAULT_DEVNET_SERVER } from './constants';
import {
  DEFAULT_MAINNET_SERVER,
  DEFAULT_TESTNET_SERVER,
  MAINNET_BTC_ADDRESS_BASE_URL,
  MAINNET_BTC_BLOCK_BASE_URL,
  MAINNET_BTC_TX_BASE_URL,
  TESTNET_BTC_ADDRESS_BASE_URL,
  TESTNET_BTC_BLOCK_BASE_URL,
  TESTNET_BTC_TX_BASE_URL,
} from './env';

export const NetworkIdModeMap: { [key in ChainID]: NetworkModes } = {
  [ChainID.Mainnet]: NetworkModes.Mainnet,
  [ChainID.Testnet]: NetworkModes.Testnet,
};

export const NetworkModeUrlMap: Record<NetworkModes, string> = {
  [NetworkModes.Mainnet]: DEFAULT_MAINNET_SERVER,
  [NetworkModes.Testnet]: DEFAULT_TESTNET_SERVER,
};

export const NetworkModeBtcBlockBaseUrlMap: Record<NetworkModes, string> = {
  [NetworkModes.Mainnet]: MAINNET_BTC_BLOCK_BASE_URL,
  [NetworkModes.Testnet]: TESTNET_BTC_BLOCK_BASE_URL,
};

export const NetworkModeBtcTxBaseUrlMap: Record<NetworkModes, string> = {
  [NetworkModes.Mainnet]: MAINNET_BTC_TX_BASE_URL,
  [NetworkModes.Testnet]: TESTNET_BTC_TX_BASE_URL,
};

export const NetworkModeBtcAddressBaseUrlMap: Record<NetworkModes, string> = {
  [NetworkModes.Mainnet]: MAINNET_BTC_ADDRESS_BASE_URL,
  [NetworkModes.Testnet]: TESTNET_BTC_ADDRESS_BASE_URL,
};

export const mainnetNetwork: Network = {
  label: 'Stacks Mainnet',
  url: NetworkModeUrlMap[NetworkModes.Mainnet],
  btcBlockBaseUrl: NetworkModeBtcBlockBaseUrlMap[NetworkModes.Mainnet],
  btcTxBaseUrl: NetworkModeBtcTxBaseUrlMap[NetworkModes.Mainnet],
  btcAddressBaseUrl: NetworkModeBtcAddressBaseUrlMap[NetworkModes.Mainnet],
  networkId: ChainID.Mainnet,
  mode: NetworkModes.Mainnet,
};

export const testnetNetwork: Network = {
  label: 'Stacks Testnet (Primary)',
  url: NetworkModeUrlMap[NetworkModes.Testnet],
  btcBlockBaseUrl: NetworkModeBtcBlockBaseUrlMap[NetworkModes.Testnet],
  btcTxBaseUrl: NetworkModeBtcTxBaseUrlMap[NetworkModes.Testnet],
  btcAddressBaseUrl: NetworkModeBtcAddressBaseUrlMap[NetworkModes.Testnet],
  networkId: ChainID.Testnet,
  mode: NetworkModes.Testnet,
};

export const nakamotoTestnetNetwork: Network = {
  label: 'Nakamoto Testnet',
  url: 'https://api.nakamoto.testnet.hiro.so',
  btcBlockBaseUrl: NetworkModeBtcBlockBaseUrlMap[NetworkModes.Testnet],
  btcTxBaseUrl: NetworkModeBtcTxBaseUrlMap[NetworkModes.Testnet],
  btcAddressBaseUrl: NetworkModeBtcAddressBaseUrlMap[NetworkModes.Testnet],
  networkId: 2147483904 as ChainID,
  mode: NetworkModes.Testnet,
  isCustomNetwork: true,
};

export const oldTestnetNetwork: Network = {
  label: 'Stacks Testnet (Archive)',
  url: 'https://api.old.testnet.hiro.so',
  btcBlockBaseUrl: NetworkModeBtcBlockBaseUrlMap[NetworkModes.Testnet],
  btcTxBaseUrl: NetworkModeBtcTxBaseUrlMap[NetworkModes.Testnet],
  btcAddressBaseUrl: NetworkModeBtcAddressBaseUrlMap[NetworkModes.Testnet],
  networkId: ChainID.Testnet,
  mode: NetworkModes.Testnet,
  isCustomNetwork: true,
};

export const devnetNetwork: Network = {
  label: 'Devnet',
  url: DEFAULT_DEVNET_SERVER,
  btcBlockBaseUrl: NetworkModeBtcBlockBaseUrlMap[NetworkModes.Testnet],
  btcTxBaseUrl: NetworkModeBtcTxBaseUrlMap[NetworkModes.Testnet],
  btcAddressBaseUrl: NetworkModeBtcAddressBaseUrlMap[NetworkModes.Testnet],
  networkId: ChainID.Testnet,
  mode: NetworkModes.Testnet,
  isCustomNetwork: true,
};
