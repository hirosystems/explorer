'use client';

import { AnalyticsBrowser } from '@segment/analytics-next';

import { NEXT_PUBLIC_SEGMENT_WRITE_KEY } from '../constants/env';

export const analytics = NEXT_PUBLIC_SEGMENT_WRITE_KEY
  ? AnalyticsBrowser.load({
      writeKey: NEXT_PUBLIC_SEGMENT_WRITE_KEY,
    })
  : undefined;
