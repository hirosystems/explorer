import { ChainID } from '@stacks/transactions';

import { NetworkModes } from '../types/network';
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
