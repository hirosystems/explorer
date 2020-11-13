import { useCallback } from 'react';
import { showConnect, AuthOptions } from '@stacks/connect';
import { useAuthState } from '@common/hooks/use-auth';

export const useConnect = () => {
  const { userData, authOptions } = useAuthState();

  const doOpenAuth = useCallback(() => showConnect(authOptions as AuthOptions), [authOptions]);
  return { authOptions, userData, doOpenAuth };
};
