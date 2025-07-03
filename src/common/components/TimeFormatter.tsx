'use client';

import { formatTimestamp } from '@/common/utils/time-utils';

export function TimeFormatter({ timestamp, format }: { timestamp: number; format?: string }) {
  return (
    <span suppressHydrationWarning={true}>
      {formatTimestamp(timestamp, format)}
    </span>
  );
}
