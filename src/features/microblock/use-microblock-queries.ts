import { Block, Microblock } from '@stacks/stacks-blockchain-api-types';

import { apiClients, createConfig } from '@common/api/client';
import { useAppSelector } from '@common/state/hooks';
import { selectActiveNetwork } from '@common/state/network-slice';

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
  const network = useAppSelector(selectActiveNetwork);
  return getMicroblockQueries(network.url);
};
