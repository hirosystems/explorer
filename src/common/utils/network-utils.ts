import { DEFAULT_MAINNET_SERVER, DEFAULT_TESTNET_SERVER } from '../constants/env';
import { NetworkModes } from '../types/network';

export function getApiUrl(chain: string, customApiUrl?: string): string | undefined {
  if (customApiUrl) {
    return customApiUrl;
  }
  return chain === NetworkModes.Testnet
    ? DEFAULT_TESTNET_SERVER
    : chain === NetworkModes.Mainnet
      ? DEFAULT_MAINNET_SERVER
      : undefined;
}
