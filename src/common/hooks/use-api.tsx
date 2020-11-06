import { useSelector } from 'react-redux';
import { RootState } from '@store';
import { selectCurrentNetworkUrl } from '@store/ui/selectors';

export const useApiServer = (): string => {
  const { apiServer } = useSelector((state: RootState) => ({
    apiServer: selectCurrentNetworkUrl(state),
  }));
  return apiServer || '';
};
