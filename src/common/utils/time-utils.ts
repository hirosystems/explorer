import { UTCDate } from '@date-fns/utc';
import { format, formatDistanceToNow } from 'date-fns';

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

export function formatTimestampTo12HourTime(
  timestampInSeconds: number,
  options: { useLocalTime?: boolean; includeSeconds?: boolean } | undefined = {
    useLocalTime: false,
    includeSeconds: true,
  }
) {
  const date = new Date(timestampInSeconds * 1000);

  let hours = options?.useLocalTime ? date.getHours() : date.getUTCHours();
  let minutes = options?.useLocalTime ? date.getMinutes() : date.getUTCMinutes();
  let seconds = options?.useLocalTime ? date.getSeconds() : date.getUTCSeconds();

  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  if (hours === 0) hours = 12;

  const paddedMinutes = minutes < 10 ? `0${minutes}` : minutes;
  const paddedSeconds = options?.includeSeconds ? (seconds < 10 ? `0${seconds}` : seconds) : '';

  const tzLabel = options?.useLocalTime ? '' : '(UTC)';

  return `${hours}:${paddedMinutes}${options?.includeSeconds ? `:${paddedSeconds}` : ''}${ampm ? ` ${ampm}` : ''}${tzLabel ? ` ${tzLabel}` : ''}`;
}

export function formatTimestamp(
  timestampInSeconds: number,
  formatString: string = 'yyyy-MM-dd HH:mm:ss'
): string {
  const date = new Date(timestampInSeconds * 1000);
  const formatted = format(date, formatString);
  return formatted;
}

export function formatTimestampToRelativeTime(timestampInSeconds: number): string {
  const date = new Date(timestampInSeconds * 1000);
  let relativeTime = formatDistanceToNow(date, { addSuffix: true });
  if (relativeTime.startsWith('less than a minute')) {
    relativeTime = relativeTime.replace('less than a minute', '<1 minute');
  }
  if (relativeTime.startsWith('about ')) {
    relativeTime = relativeTime.replace('about ', '~');
  }
  if (relativeTime.startsWith('almost ')) {
    relativeTime = relativeTime.replace('almost ', '~');
  }
  if (relativeTime.startsWith('over ')) {
    relativeTime = relativeTime.replace('over ', '>');
  }
  return relativeTime;
}
