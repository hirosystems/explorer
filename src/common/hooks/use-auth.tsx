import { useEffect, useState } from 'react';
import useConstant from 'use-constant';
import debounce from 'awesome-debounce-promise';
import { useRecoilState } from 'recoil';
import { authOptionsAtom, userDataAtom, userSession } from '@store/sandbox';
import type { AuthOptions, FinishedData } from '@stacks/connect';
import { CONNECT_AUTH_ORIGIN } from '@common/constants';

export const useAuthState = () => {
  const [authOptions, setAuthOptions] = useRecoilState<Partial<AuthOptions>>(authOptionsAtom);
  const [userData, setUserData] = useRecoilState(userDataAtom);

  return { userData, setUserData, authOptions, setAuthOptions };
};

export const useAuth = () => {
  const { setUserData, setAuthOptions } = useAuthState();
  const [iconPath, setIconPath] = useState<string | undefined>('');

  // we are using useConstant and debounce because it seems connect fires this fn many times
  // https://github.com/blockstack/ux/issues/444
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  const onFinish = useConstant(() =>
    debounce((payload: FinishedData) => {
      const userData = payload.userSession.loadUserData();
      setUserData(userData);
    }, 350)
  );

  useEffect(() => {
    const iconPrefix = typeof document !== 'undefined' ? document.location.origin.toString() : '';
    if (iconPath === '' && typeof document !== 'undefined') {
      setIconPath(iconPrefix);
      setAuthOptions({
        onFinish,
        manifestPath: '/manifest.json',
        authOrigin: CONNECT_AUTH_ORIGIN,
        redirectTo: '/sandbox',
        userSession: userSession as any,
        appDetails: {
          name: 'Stacks Explorer',
          icon: `${iconPath}/app-icon.png`,
        },
      });
    }
  }, []);
};
