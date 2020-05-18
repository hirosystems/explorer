import { useCallback } from 'react';

import { useToast } from '@common/hooks/use-toast';
import { useConfigState } from '@common/hooks/use-config-state';
import { navgiateToRandomTx } from '@common/utils';

export const useNavigateToRandomTx = () => {
  const { apiServer } = useConfigState();

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
