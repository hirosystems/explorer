import { useCallback } from 'react';
import { showConnect, AuthOptions } from '@stacks/connect';
import { useAuthState } from '@common/hooks/use-auth';

export const useConnect = () => {
  const { userData, authOptions, userSession, resetUserData } = useAuthState();

  const doOpenAuth = useCallback(() => showConnect(authOptions as AuthOptions), [authOptions]);
  const doSignOut = useCallback(() => {
    userSession?.signUserOut();
    resetUserData();
  }, [resetUserData, userSession]);

  return { authOptions, userData, doOpenAuth, doSignOut };
};
