import { StacksTestnet } from '@stacks/network';
import { useApiServer } from '@common/hooks/use-api';
// for use with connect
export const useNetworkConfig = () => {
  const apiServer = useApiServer();
  const network = new StacksTestnet();
  network.coreApiUrl = apiServer;
  return network;
};
