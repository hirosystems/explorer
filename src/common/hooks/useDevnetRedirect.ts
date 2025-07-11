import { ReadonlyURLSearchParams } from 'next/navigation';
import { useEffect } from 'react';

import { DEVNET_PORT, DEVNET_SERVER } from '../constants/env';
import { isLocalhost } from '../utils/network-utils';

interface UseDevnetRedirectParams {
  api: string | null;
  ssr: string | null;
  searchParams: ReadonlyURLSearchParams;
  pathname: string;
}

export function useDevnetRedirect({ api, ssr, searchParams, pathname }: UseDevnetRedirectParams) {
  useEffect(() => {
    const currentUrl = typeof window !== 'undefined' ? window.location : null;

    // check if this is a bare localhost URL on devnet port (no query params)
    if (
      currentUrl &&
      currentUrl.hostname === 'localhost' &&
      currentUrl.port === DEVNET_PORT &&
      currentUrl.search === ''
    ) {
      const params = new URLSearchParams();
      params.set('chain', 'testnet');
      params.set('api', DEVNET_SERVER);
      params.set('ssr', 'false');
      window.location.replace(`${pathname}?${params.toString()}`);
      return;
    }

    // add ssr=false if api parameter points to devnet but ssr is missing
    if (api && !ssr && isLocalhost(api)) {
      const params = new URLSearchParams(searchParams);
      params.set('ssr', 'false');
      window.location.replace(`${pathname}?${params.toString()}`);
    }
  }, [api, ssr, searchParams, pathname]);
}
