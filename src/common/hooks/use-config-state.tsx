import { useSelector } from 'react-redux';
import { RootState } from '@store';
import {
  selectNetworks,
  selectCurrentNetworkName,
  selectCurrentNetworkUrl,
} from '@store/ui/selectors';

export const useConfigState = () => {
  const { networks, selectedNetwork, apiServer } = useSelector((state: RootState) => ({
    networks: selectNetworks(state),
    selectedNetwork: selectCurrentNetworkName(state),
    apiServer: selectCurrentNetworkUrl(state),
  }));
  return {
    networks,
    selectedNetwork,
    apiServer,
  };
};
