'use client';

import { AnalyticsBrowser } from '@segment/analytics-next';

const { SEGMENT_WRITE_KEY } = process.env;

export const analytics = SEGMENT_WRITE_KEY
  ? AnalyticsBrowser.load({
      writeKey: SEGMENT_WRITE_KEY,
    })
  : undefined;
