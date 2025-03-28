import { UTCDate } from '@date-fns/utc';

import { isStringNumber } from './number-utils';

export function getReadableTimestamp(ts: number): string {
  return ts
    ? `${new Date(ts * 1000).toLocaleTimeString()} ${new Date(ts * 1000).toLocaleDateString()}`
    : '';
}

export function parseTimestamp(ts: string): number | null {
  return isStringNumber(ts) ? Number(ts) : null;
}

export function getUTCDate(ts: number): UTCDate {
  return new UTCDate(ts * 1000);
}

export function parseUTCDate(ts: string): UTCDate | null {
  const parsedTs = parseTimestamp(ts);
  return parsedTs ? getUTCDate(parsedTs) : null;
}

export const formatDate = (
  date: UTCDate,
  options: Intl.DateTimeFormatOptions = { month: '2-digit', day: '2-digit', year: 'numeric' },
  locale: string | string[] = 'en-US'
): string => {
  return date.toLocaleDateString(locale, options);
};
