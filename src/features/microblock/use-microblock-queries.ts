import { apiClients, createConfig } from '@/common/api/client';
import { useGlobalContext } from '@/common/context/useAppContext';

import { Microblock } from '@stacks/stacks-blockchain-api-types';

export const getMicroblockQueries = (networkUrl: string) => {
  const clients = apiClients(createConfig(networkUrl));

  const fetchMicroblock = async (blockHash?: string) =>
    blockHash
      ? ((await clients.microblocksApi.getMicroblockByHash({
          hash: blockHash,
        })) as Microblock)
      : undefined;

  return {
    fetchMicroblock: (blockHash?: string) => () => fetchMicroblock(blockHash),
  };
};

export const useTransactionQueries = () => {
  const network = useGlobalContext().activeNetwork;
  return getMicroblockQueries(network.url);
};
