import { useRouter } from 'next/router';

import { VERSION } from '@common/constants';

// TODO: Replace any type w/ SegmentAnalytics
// import { SegmentAnalytics } from '@segment/analytics.js-core';
declare const global: any;

export interface AnalyticsProps {
  event: string;
  properties?: Record<string, unknown> | undefined;
  options?: Record<string, unknown> | undefined;
  callback?: () => void | undefined;
}

export function useAnalytics() {
  const { asPath, query } = useRouter();

  const defaultOptions = {
    network: query.chain,
    route: asPath,
    version: VERSION,
  };

  if (!global.analytics)
    return {
      track: () => undefined,
    };

  return {
    track: (args: AnalyticsProps) => {
      const { event, properties, options, callback } = args;
      return global.analytics.track(event, { ...defaultOptions, ...properties }, options, callback);
    },
  };
}
