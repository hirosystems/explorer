import { useRecoilState, useResetRecoilState } from 'recoil';
import { userDataAtom, userSession } from '@sandbox/store/sandbox';
import { authResponseState } from '@store/recoil/auth';
import { buildUrl } from '@components/links';
import { APP_DETAILS } from '@common/constants';

export const useAuthState = () => {
  const authOptions = {
    manifestPath: '/manifest.json',
    redirectTo: buildUrl('/sandbox'),
    userSession: userSession as any,
    appDetails: APP_DETAILS,
  };
  const [authResponse, setAuthResponse] = useRecoilState(authResponseState);
  const [userData, setUserData] = useRecoilState(userDataAtom);
  const resetUserData = useResetRecoilState(userDataAtom);

  const handleSetAuthResponse = (_authResponse: string) => {
    setAuthResponse(_authResponse);
  };

  return {
    isSignedIn: !!userData,
    userData,
    setUserData,
    authOptions,
    userSession: authOptions.userSession,
    resetUserData,
    authResponse,
    setAuthResponse: handleSetAuthResponse,
  };
};
