import { useRouter } from 'next/router';
import { VERSION } from '@common/constants';
// import { SegmentAnalytics } from '@segment/analytics.js-core';

// TODO: Move this to a global location and
// replace any type w/ SegmentAnalytics
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
      page: () => undefined,
      track: () => undefined,
    };

  return {
    page: (url: string) => {
      return global.analytics.page(url);
    },
    track: (args: AnalyticsProps) => {
      const { event, properties, options, callback } = args;
      return global.analytics.track(event, { ...defaultOptions, ...properties }, options, callback);
    },
  };
}
