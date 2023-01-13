import { apiClients, createConfig } from '@/common/api/client';
import { useGlobalContext } from '@/common/context/useAppContext';

import { Block } from '@stacks/stacks-blockchain-api-types';

export const getBlockQueries = (networkUrl: string) => {
  const clients = apiClients(createConfig(networkUrl));
  const fetchBlock = async (blockHash?: string) =>
    blockHash
      ? ((await clients.blocksApi.getBlockByHash({
          hash: blockHash,
        })) as Block)
      : undefined;

  return {
    fetchBlock: (blockHash?: string) => () => fetchBlock(blockHash),
  };
};

export const useBlockQueries = () => {
  const network = useGlobalContext().activeNetwork;
  return getBlockQueries(network.url);
};
