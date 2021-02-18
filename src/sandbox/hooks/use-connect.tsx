import { useCallback } from 'react';
import { showConnect, AuthOptions, FinishedData } from '@stacks/connect';
import { useAuthState } from '@sandbox/hooks/use-auth';
import { useSetRecoilState } from 'recoil';
import { rightPanelState } from '@sandbox/store/views';

export const useConnect = () => {
  const {
    isSignedIn,
    userData,
    authOptions,
    userSession,
    resetUserData,
    setUserData,
  } = useAuthState();
  const setPanelVisibility = useSetRecoilState(rightPanelState);

  const onFinish = async (finishedData: FinishedData) => {
    if (userSession) {
      const data = await userSession.loadUserData();
      setUserData(data);
    }
  };

  const doOpenAuth = useCallback(
    () =>
      showConnect({
        ...(authOptions as AuthOptions),
        onFinish,
      }),
    [authOptions, onFinish]
  );
  const doSignOut = useCallback(() => {
    userSession?.signUserOut();
    resetUserData();
    setPanelVisibility('hidden');
  }, [setPanelVisibility, resetUserData, userSession]);

  return { authOptions, userData, doOpenAuth, isSignedIn, doSignOut };
};
