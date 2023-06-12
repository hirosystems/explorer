import { DEFAULT_TESTNET_SERVER } from '@/common/constants';

export const fetchTestnetStatus = (): Promise<{ status: string }> => {
  return window.fetch(DEFAULT_TESTNET_SERVER + '/extended/v1/status').then(res => res.json());
};
