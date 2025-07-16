import { DEFAULT_DEVNET_SERVER } from '../constants/constants';
import { DEFAULT_MAINNET_SERVER, DEFAULT_TESTNET_SERVER } from '../constants/env';
import { Network, NetworkModes } from '../types/network';

export function getApiUrl(chain: string, customApiUrl?: string): string {
  if (customApiUrl) {
    return customApiUrl;
  }
  if (chain === NetworkModes.Testnet) {
    return DEFAULT_TESTNET_SERVER;
  }
  return DEFAULT_MAINNET_SERVER;
}

export function isHiroSubdomain(url: string): boolean {
  try {
    const parsedUrl = new URL(url);
    const hostname = parsedUrl.hostname;
    return hostname.endsWith(`.hiro.so`);
  } catch {
    return false;
  }
}
export function isLocalhost(url: string): boolean {
  try {
    const parsedUrl = new URL(url);
    return parsedUrl.hostname === 'localhost';
  } catch {
    return false;
  }
}
