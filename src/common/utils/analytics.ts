'use client';

import { AnalyticsBrowser } from '@segment/analytics-next';
import { SEGMENT_WRITE_KEY } from "../constants/env";

export const analytics = SEGMENT_WRITE_KEY
  ? AnalyticsBrowser.load({
      writeKey: SEGMENT_WRITE_KEY,
    })
  : undefined;
