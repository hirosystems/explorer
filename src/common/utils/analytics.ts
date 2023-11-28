'use client';

import { AnalyticsBrowser } from '@segment/analytics-next';

import { NEXT_PUBLIC_SEGMENT_WRITE_KEY, SEGMENT_WRITE_KEY } from "../constants/env";

console.log('SEGMENT_WRITE_KEY', SEGMENT_WRITE_KEY);
console.log('SEGMENT_WRITE_KEY', NEXT_PUBLIC_SEGMENT_WRITE_KEY);
export const analytics = SEGMENT_WRITE_KEY
  ? AnalyticsBrowser.load({
      writeKey: SEGMENT_WRITE_KEY,
    })
  : undefined;
