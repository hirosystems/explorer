export const withApiServer = (apiServer: string) => (path?: string) =>
  path ? apiServer + path : apiServer;

export const IS_DEV = process.env.NODE_ENV !== 'production';
export const IS_STAGING = process.env.STAGING === 'enabled';

export const DEFAULT_TESETNET_SERVER = 'https://stacks-node-api.xenon.blockstack.org';

export const NETWORK_LIST_COOKIE = 'network-list';
export const NETWORK_CURRENT_INDEX_COOKIE = 'network-current';
export const DEFAULT_NETWORK_INDEX = 0;
export const DEFAULT_NETWORK_LIST = [
  {
    label: 'Testnet',
    url: process.env.TESTNET_API_SERVER || DEFAULT_TESETNET_SERVER,
  },
  {
    label: 'Localhost',
    url: 'http://localhost:3999',
  },
];
