'use client';

import { AnalyticsBrowser } from '@segment/analytics-next';

import { NEXT_PUBLIC_SEGMENT_WRITE_KEY } from "../constants/env";

console.log('NEXT_PUBLIC_SEGMENT_WRITE_KEY', NEXT_PUBLIC_SEGMENT_WRITE_KEY)

export const analytics = NEXT_PUBLIC_SEGMENT_WRITE_KEY
  ? AnalyticsBrowser.load({
      writeKey: NEXT_PUBLIC_SEGMENT_WRITE_KEY,
    })
  : undefined;
