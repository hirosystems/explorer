import { useCallback, useEffect, useState } from 'react';
import useConstant from 'use-constant';
import debounce from 'awesome-debounce-promise';
import { useRecoilState, useResetRecoilState } from 'recoil';
import { authOptionsAtom, userDataAtom, userSession } from '@store/sandbox';
import type { AuthOptions, FinishedData } from '@stacks/connect';
import { CONNECT_AUTH_ORIGIN, IS_BROWSER } from '@common/constants';
import { useRouter } from 'next/router';

export const useAuthState = () => {
  const [authOptions, setAuthOptions] = useRecoilState<Partial<AuthOptions>>(authOptionsAtom);
  const [userData, setUserData] = useRecoilState(userDataAtom);
  const resetUserData = useResetRecoilState(userDataAtom);

  return {
    userData,
    setUserData,
    authOptions,
    setAuthOptions,
    userSession: authOptions.userSession,
    resetUserData,
  };
};

export const useAuth = () => {
  const [authResponse, setAuthResponse] = useState<string | undefined>(undefined);
  const { setUserData, setAuthOptions } = useAuthState();
  const [iconPath, setIconPath] = useState<string | undefined>('');
  const router = useRouter();

  // we are using useConstant and debounce because it seems connect fires this fn many times
  // https://github.com/blockstack/ux/issues/444
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  const onFinish = useConstant(() =>
    debounce((payload: FinishedData) => {
      const userData = payload.userSession.loadUserData();
      setUserData(userData);
    }, 350)
  );

  const handleRemoveAuthResponseQuery = useCallback(async () => {
    if (IS_BROWSER) {
      const query = router.query;
      delete query['authResponse'];
      await router.replace(
        {
          pathname: router.pathname,
          query,
        },
        {
          pathname: router.pathname,
          query,
        },
        { shallow: true }
      );
    }
  }, [IS_BROWSER, router]);

  const handlePendingSignIn = useCallback(async () => {
    try {
      const userData = await userSession.handlePendingSignIn(authResponse);
      await handleRemoveAuthResponseQuery();
      setUserData(userData);
      setAuthResponse(undefined);
    } catch (e) {
      console.error(e.message);
      await handleRemoveAuthResponseQuery();
    }
  }, [
    IS_BROWSER,
    IS_BROWSER && document.location.search,
    userSession,
    router,
    setUserData,
    setAuthResponse,
  ]);

  const isSignedIn = userSession.isUserSignedIn();

  useEffect(() => {
    if (!isSignedIn) {
      if (router.query.authResponse && !authResponse) {
        setAuthResponse(router.query.authResponse as string);
      }
      if (authResponse) {
        void handlePendingSignIn();
      }
    } else {
      if (router.query.authResponse) {
        void handleRemoveAuthResponseQuery();
      }
    }
  }, [router.query, setAuthResponse, authResponse, isSignedIn]);

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
