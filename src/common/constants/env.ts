import packageJson from '../../../package.json';

export const CONNECT_AUTH_ORIGIN =
  process.env.NEXT_PUBLIC_CONNECT_AUTH_ORIGIN || 'https://pr-725.app.stacks.engineering';
export const DEFAULT_MAINNET_SERVER =
  process.env.NEXT_PUBLIC_MAINNET_API_SERVER || 'https://api.hiro.so';
export const MAINNET_BTC_BLOCK_BASE_URL =
  process.env.NEXT_PUBLIC_MAINNET_BTC_BLOCK_BASE_URL || 'https://mempool.space/block';
export const MAINNET_BTC_TX_BASE_URL =
  process.env.NEXT_PUBLIC_MAINNET_BTC_TX_BASE_URL || 'https://mempool.space/tx';
export const MAINNET_BTC_ADDRESS_BASE_URL =
  process.env.NEXT_PUBLIC_MAINNET_BTC_ADDRESS_BASE_URL || 'https://mempool.space/address';
export const DEFAULT_TESTNET_SERVER =
  process.env.NEXT_PUBLIC_TESTNET_API_SERVER || 'https://api.testnet.hiro.so';
export const TESTNET_BTC_BLOCK_BASE_URL =
  process.env.NEXT_PUBLIC_TESTNET_BTC_BLOCK_BASE_URL || 'https://mempool.space/testnet/block';
export const TESTNET_BTC_TX_BASE_URL =
  process.env.NEXT_PUBLIC_TESTNET_BTC_TX_BASE_URL || 'https://mempool.space/testnet/tx';
export const TESTNET_BTC_ADDRESS_BASE_URL =
  process.env.NEXT_PUBLIC_TESTNET_BTC_ADDRESS_BASE_URL || 'https://mempool.space/testnet/address';
export const VERSION = process.env.VERSION || process.env.VERSION || packageJson.version;
export const X_API_KEY = process.env.X_API_KEY ?? process.env.X_API_KEY ?? '';
export const RELEASE_TAG_NAME =
  process.env.RELEASE_TAG_NAME ?? process.env.RELEASE_TAG_NAME ?? null;
export const REDIS_URL = process.env.REDIS_URL || '';
export const NODE_ENV = process.env.NODE_ENV || '';
export const NEXT_PUBLIC_SEGMENT_WRITE_KEY = process.env.NEXT_PUBLIC_SEGMENT_WRITE_KEY || '';

export const HIRO_HEADERS: HeadersInit = {
  'x-api-key': X_API_KEY,
  'x-hiro-product': 'explorer',
  'x-hiro-version': VERSION,
};
