import { formatDateShort } from '@/common/utils/date-utils';

import type { Bond, BondSchedulePoint } from './data';
import { burnHeightToApproximateTimestamp } from './projections';

export function resolveBondDate(
  height: number,
  currentBurnHeight: number | undefined,
  nowMs: number,
  burnBlockTimes: Record<number, number> = {},
  schedule?: Bond['schedule']
): { timestampMs: number; estimated: boolean } | undefined {
  if (!Number.isFinite(height) || height <= 0) return undefined;
  const point = Object.values(schedule ?? {}).find(point => point?.bitcoin_height === height);
  if (point?.time != null && Number.isFinite(point.time)) {
    return { timestampMs: point.time * 1000, estimated: false };
  }
  // A known mined block time is more authoritative than a stale projection.
  if (Number.isFinite(burnBlockTimes[height])) {
    return { timestampMs: burnBlockTimes[height], estimated: false };
  }
  if (point?.projected_time != null && Number.isFinite(point.projected_time)) {
    return { timestampMs: point.projected_time * 1000, estimated: true };
  }
  if (
    currentBurnHeight === undefined ||
    !Number.isFinite(currentBurnHeight) ||
    currentBurnHeight <= 0
  )
    return undefined;
  return {
    timestampMs: burnHeightToApproximateTimestamp(height, currentBurnHeight, nowMs),
    estimated: true,
  };
}

export function formatBondDate(
  height: number,
  currentBurnHeight: number | undefined,
  nowMs: number,
  burnBlockTimes: Record<number, number> = {},
  schedule?: Bond['schedule'],
  formatDate: (timestamp: number) => string = formatDateShort
): string {
  const date = resolveBondDate(height, currentBurnHeight, nowMs, burnBlockTimes, schedule);
  return date ? `${date.estimated ? '~' : ''}${formatDate(date.timestampMs)}` : 'Unavailable';
}

function mergePoint(summary: BondSchedulePoint | undefined, detail: BondSchedulePoint) {
  if (summary?.bitcoin_height !== detail.bitcoin_height) return detail;
  return {
    ...detail,
    time: detail.time ?? summary.time,
    time_iso: detail.time_iso ?? summary.time_iso,
    projected_time: detail.projected_time ?? summary.projected_time,
    projected_time_iso: detail.projected_time_iso ?? summary.projected_time_iso,
  };
}

export function mergeBondDetail(summary: Bond, detail: Bond): Bond {
  return {
    ...detail,
    schedule: {
      activation: mergePoint(summary.schedule.activation, detail.schedule.activation),
      unlock: mergePoint(summary.schedule.unlock, detail.schedule.unlock),
      enrollment_cutoff: detail.schedule.enrollment_cutoff
        ? mergePoint(summary.schedule.enrollment_cutoff, detail.schedule.enrollment_cutoff)
        : summary.schedule.enrollment_cutoff,
    },
  };
}
