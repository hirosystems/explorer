import { DEFAULT_MAINNET_SERVER, DEFAULT_TESTNET_SERVER } from '../constants/env';

export function getApiUrl(chain: string): string | undefined {
  return chain === 'mainnet'
    ? DEFAULT_MAINNET_SERVER
    : chain === 'testnet'
      ? DEFAULT_TESTNET_SERVER
      : undefined;
}
