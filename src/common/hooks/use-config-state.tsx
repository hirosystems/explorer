import { useSelector } from 'react-redux';
import { RootState } from '@store';
import {
  selectNetworks,
  selectCurrentNetworkName,
  selectCurrentNetworkUrl,
  selectEnv,
} from '@store/ui/selectors';

export const useConfigState = () => {
  const { networks, selectedNetwork, apiServer, isStaging } = useSelector((state: RootState) => ({
    networks: selectNetworks(state),
    selectedNetwork: selectCurrentNetworkName(state),
    apiServer: selectCurrentNetworkUrl(state),
    isStaging: selectEnv(state) && selectEnv(state) === 'STAGING',
  }));
  return {
    networks,
    selectedNetwork,
    apiServer,
    isStaging,
  };
};
