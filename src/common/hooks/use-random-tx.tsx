import { useCallback } from 'react';
import { navgiateToRandomTx } from '@common/utils';
import { useToast } from '@common/hooks/use-toast';

export const useNavigateToRandomTx = () => {
  const { addCriticalToast } = useToast();
  const handleRandomTxClick = useCallback(async () => {
    try {
      await navgiateToRandomTx();
    } catch (e) {
      addCriticalToast({
        message: e.name,
        description: e.message,
      });
    }
  }, []);

  return handleRandomTxClick;
};
