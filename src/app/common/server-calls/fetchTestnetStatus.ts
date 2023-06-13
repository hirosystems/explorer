import { useApi } from '@/common/api/client';
import { DEFAULT_TESTNET_SERVER } from '@/common/constants';

export const fetchTsOfChainTip = (api: ReturnType<typeof useApi>): Promise<string | null> => {
  return window
    .fetch(DEFAULT_TESTNET_SERVER + '/extended/v1/status')
    .then(res => res.json())
    .then(res => {
      const hash: string = res?.chain_tip?.block_hash;
      if (!hash) return null;
      return api.blocksApi.getBlockByHash({ hash });
    })
    .then(data => {
      const ts = data?.burn_block_time_iso;
      if (!ts) return null;
      return ts;
    });
};
