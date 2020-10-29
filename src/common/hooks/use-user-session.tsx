import * as React from 'react';
import { UserSession, AppConfig, UserData } from '@stracks/auth';

export const useUserSession = () => {
  const [userData, setUserData] = React.useState<{ loaded: boolean } & Partial<UserData>>({
    loaded: false,
  });
  const [signedIn, setSignedIn] = React.useState(false);
  const appConfig = new AppConfig(['store_write', 'publish_data']);
  const userSession = new UserSession({ appConfig });
  React.useEffect(() => {
    if (!signedIn && userSession.isUserSignedIn()) {
      setSignedIn(true);
    }
  }, [userSession.isUserSignedIn()]);

  React.useEffect(() => {
    if (!userData.loaded && signedIn) {
      setUserData(s => ({
        ...userSession.loadUserData(),
        loaded: true,
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
