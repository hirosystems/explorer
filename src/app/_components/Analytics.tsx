'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

import { analytics } from '../../common/utils/analytics';

export function Analytics() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    console.log('analytics', analytics);
    void analytics?.page();
  }, [pathname, searchParams]);

  return null;
}
