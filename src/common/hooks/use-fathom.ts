import { useEffect } from 'react';
import { useRouter } from 'next/router';
import * as Fathom from 'fathom-client';
import { IS_BROWSER, IS_DEV } from '@common/constants';

function onRouteChangeComplete() {
  Fathom.trackPageview();
}

export const useFathom = () => {
  const router = useRouter();

  useEffect(() => {
    if (!IS_DEV && IS_BROWSER) {
      Fathom.load('YAKFSIOZ', {
        includedDomains: ['explorer.stacks.co'],
      });

      const handleRouteChange = () => onRouteChangeComplete();

      router.events.on('routeChangeComplete', handleRouteChange);

      return () => {
        router.events.off('routeChangeComplete', handleRouteChange);
      };
    }
  }, []);
};
