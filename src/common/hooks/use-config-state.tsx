import { useSelector } from 'react-redux';
import { RootState } from '@store';
import { selectNetworks, selectCurrentNetworkUrl } from '@store/ui/selectors';

export const useConfigState = () => {
  const { networks, apiServer } = useSelector((state: RootState) => ({
    networks: selectNetworks(state),
    apiServer: selectCurrentNetworkUrl(state),
  }));
  return {
    networks,
    apiServer,
  };
};
