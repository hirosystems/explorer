import { DEFAULT_MAINNET_SERVER, DEFAULT_TESTNET_SERVER } from '../constants/env';

export function getApiUrl(chain: string, customApiUrl?: string): string | undefined {
  if (customApiUrl) {
    return customApiUrl;
  }
  return chain === 'mainnet'
    ? DEFAULT_MAINNET_SERVER
    : chain === 'testnet'
      ? DEFAULT_TESTNET_SERVER
      : undefined;
}
