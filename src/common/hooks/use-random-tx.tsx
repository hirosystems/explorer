import { useCallback } from 'react';
import { navgiateToRandomTx } from '@common/utils';
import { useToast } from '@common/hooks/use-toast';
import { useSelector } from 'react-redux';
import { selectCurrentNetworkUrl } from '@store/ui/selectors';
import { RootState } from '@store';

export const useNavigateToRandomTx = () => {
  const { apiServer } = useSelector((state: RootState) => ({
    apiServer: selectCurrentNetworkUrl(state),
  }));
  const { addCriticalToast } = useToast();
  const handleRandomTxClick = useCallback(async () => {
    try {
      await navgiateToRandomTx(apiServer as string)();
    } catch (e) {
      addCriticalToast({
        message: e.name,
        description: e.message,
      });
    }
  }, [apiServer]);

  return handleRandomTxClick;
};
