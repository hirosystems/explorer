import { useEffect } from 'react';
import { useRouter } from 'next/router';
import * as Fathom from 'fathom-client';
import { FATHOM_ID } from '@common/constants';

export const useFathom = () => {
  const router = useRouter();

  useEffect(() => {
    Fathom.load(FATHOM_ID, {
      includedDomains: ['https://explorer.stacks.co'],
    });

    function onRouteChangeComplete() {
      Fathom.trackPageview();
    }

    router.events.on('routeChangeComplete', onRouteChangeComplete);

    return () => {
      router.events.off('routeChangeComplete', onRouteChangeComplete);
    };
  }, []);
};
