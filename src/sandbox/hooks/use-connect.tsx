import { useCallback } from 'react';
import { showConnect, AuthOptions, FinishedData } from '@stacks/connect';
import { useAuthState } from '@sandbox/hooks/use-auth';
import { useSetRecoilState } from 'recoil';
import { rightPanelState } from '@sandbox/store/views';
import { Goals, useFathomGoal } from '@common/hooks/use-fathom';

export const useConnect = () => {
  const { isSignedIn, userData, authOptions, userSession, resetUserData, setUserData } =
    useAuthState();
  const { handleTrackGoal } = useFathomGoal();
  const setPanelVisibility = useSetRecoilState(rightPanelState);

  const onFinish = (finishedData: FinishedData) => {
    if (userSession) {
      const data = userSession.loadUserData();
      setUserData(data);
    }
  };

  const doOpenAuth = useCallback(() => {
    handleTrackGoal(Goals.SANDBOX_SIGNIN);
    void showConnect({
      ...(authOptions as AuthOptions),
      onFinish,
    });
  }, [authOptions, onFinish]);
  const doSignOut = useCallback(() => {
    userSession?.signUserOut();
    resetUserData();
    setPanelVisibility('hidden');
  }, [setPanelVisibility, resetUserData, userSession]);

  return { authOptions, userData, doOpenAuth, isSignedIn, doSignOut };
};
