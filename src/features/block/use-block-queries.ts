import { apiClients, createConfig } from '@common/api/client';
import { useAppSelector } from '@common/state/hooks';
import { selectActiveNetwork } from '@common/state/network-slice';
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
  const network = useAppSelector(selectActiveNetwork);
  return getBlockQueries(network.url);
};
