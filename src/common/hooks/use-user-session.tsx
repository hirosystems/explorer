import * as React from 'react';
import { UserSession, AppConfig } from 'blockstack';
import { UserData } from 'blockstack/lib/auth/authApp';

export const useUserSession = () => {
  const [userData, setUserData] = React.useState<UserData | undefined>(undefined);
  const [signedIn, setSignedIn] = React.useState(false);
  const appConfig = new AppConfig(['store_write']);
  const userSession = new UserSession({ appConfig });
  React.useEffect(() => {
    if (!signedIn && userSession.isUserSignedIn()) {
      setSignedIn(true);
    }
  }, [userSession.isUserSignedIn()]);

  React.useEffect(() => {
    if (!userData && signedIn) {
      setUserData(s => ({
        ...userSession.loadUserData(),
      }));
    }
  }, [signedIn]);

  return {
    userSession,
    userData,
    // @ts-ignore
    address: userData?.profile?.stxAddress,
    signedIn,
    appConfig,
  };
};
