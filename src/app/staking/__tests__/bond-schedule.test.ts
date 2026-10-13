import { formatDateShort } from '@/common/utils/date-utils';

import { formatBondDate, mergeBondDetail, resolveBondDate } from '../bond-schedule';
import { toBondRow } from '../bond-transforms';
import type { Bond, ProjectedBond } from '../data';
import {
  getBondLifecycleState,
  getBondProgress,
  getBondProjections,
  getBondSchedule,
} from '../projections';
import fixture from './fixtures/bond.json';

const nowMs = Date.parse('2026-10-13T12:00:00Z');
const activationMs = Date.parse('2026-10-09T00:17:52Z');
const unlockMs = Date.parse('2027-04-01T13:42:14Z');
const bond: Bond = {
  ...fixture,
  schedule: {
    enrollment_cutoff: { bitcoin_height: 970440, pox_cycle: 144, time: 1791439352 },
    activation: { bitcoin_height: 970550, pox_cycle: 145, time: activationMs / 1000 },
    unlock: { bitcoin_height: 995750, pox_cycle: 157, projected_time: unlockMs / 1000 },
  },
};

test('uses actual API seconds for past dates and marks projected API dates as estimates', () => {
  expect(resolveBondDate(970550, 971267, nowMs, {}, bond.schedule)).toEqual({
    timestampMs: activationMs,
    estimated: false,
  });
  expect(formatBondDate(970550, 971267, nowMs, {}, bond.schedule)).toBe(
    formatDateShort(activationMs)
  );
  expect(resolveBondDate(995750, 971267, nowMs, {}, bond.schedule)).toEqual({
    timestampMs: unlockMs,
    estimated: true,
  });
  expect(formatBondDate(995750, 971267, nowMs, {}, bond.schedule)).toBe(
    `~${formatDateShort(unlockMs)}`
  );
});

test('API dates remain usable when PoX height is unavailable', () => {
  const row = toBondRow(bond, undefined, nowMs);
  expect(row.activationDate).toBe(formatDateShort(activationMs));
  expect(row.unlockDate).toBe(`~${formatDateShort(unlockMs)}`);
});

test('known mined times supersede stale projections, and API actual times supersede fallback times', () => {
  expect(
    resolveBondDate(995750, 995800, nowMs, { 995750: unlockMs + 1000 }, bond.schedule)
  ).toEqual({ timestampMs: unlockMs + 1000, estimated: false });
  expect(
    resolveBondDate(970550, 971267, nowMs, { 970550: activationMs - 1000 }, bond.schedule)
  ).toEqual({ timestampMs: activationMs, estimated: false });
});

test('null and absent API times fall back without becoming January 1970', () => {
  const schedule = {
    ...bond.schedule,
    activation: { ...bond.schedule.activation, time: null, projected_time: null },
  };
  expect(resolveBondDate(970550, 971267, nowMs, { 970550: activationMs }, schedule)).toEqual({
    timestampMs: activationMs,
    estimated: false,
  });
  expect(resolveBondDate(970550, 971267, nowMs, {}, schedule)).toEqual({
    timestampMs: nowMs + (970550 - 971267) * 600000,
    estimated: true,
  });
  expect(formatBondDate(970550, undefined, nowMs, {}, schedule)).toBe('Unavailable');
});

test('preserves list timestamps when detail timestamps are null, without copying across changed heights', () => {
  const detail: Bond = {
    ...bond,
    schedule: {
      activation: { ...bond.schedule.activation, time: null },
      unlock: { ...bond.schedule.unlock, projected_time: null },
    },
  };
  const merged = mergeBondDetail(bond, detail);
  expect(merged.schedule.activation.time).toBe(activationMs / 1000);
  expect(merged.schedule.unlock.projected_time).toBe(unlockMs / 1000);
  expect(merged.schedule.enrollment_cutoff).toEqual(bond.schedule.enrollment_cutoff);
  detail.schedule.activation.bitcoin_height++;
  expect(mergeBondDetail(bond, detail).schedule.activation.time).toBeNull();
});

test('uses the API cutoff as the first rejected enrollment height', () => {
  const schedule = getBondSchedule(970550, 995750, 2100, 100, bond.schedule);
  expect(schedule.enrollmentClosesHeight).toBe(970440);
  expect(getBondLifecycleState(schedule, 970439, true)).toBe('enrolling');
  expect(getBondLifecycleState(schedule, 970440, true)).toBe('awaitingActivation');
  expect(getBondSchedule(970550, 995750, 2100, 100).enrollmentClosesHeight).toBe(970450);
});

test('calendar day progress uses timestamps while lifecycle progress stays block based', () => {
  const schedule = getBondSchedule(970550, 995750, 2100, 100, bond.schedule);
  const fallback = getBondProgress(schedule, 971267, 2100);
  const progress = getBondProgress(schedule, 971267, 2100, { activationMs, unlockMs, nowMs });
  expect(progress.dayOfTerm).toBe(4);
  expect(progress.termDays).toBe(Math.round((unlockMs - activationMs) / 86400000));
  expect(progress.elapsedRatio).toBe(fallback.elapsedRatio);
  expect(progress.elapsedDistributions).toBe(fallback.elapsedDistributions);
});

test('future API schedules override local projections without becoming declared bonds', () => {
  const projected: ProjectedBond = {
    index: bond.index + 1,
    status: 'projected',
    schedule: {
      activation: { bitcoin_height: 974800, pox_cycle: 147, projected_time: 1794025072 },
      unlock: { bitcoin_height: 1000000, pox_cycle: 159, projected_time: 1809106934 },
    },
  };
  const result = getBondProjections([bond], 2100, 971267, [projected]);
  expect(result.nextBond?.schedule).toEqual(projected.schedule);
  expect(result.scheduledBonds[0].activationHeight).toBe(974800);
  expect(result.featuredBond).toBe(bond);
  expect(result.scheduledBonds[0]).not.toHaveProperty('parameters');
  expect(getBondProjections([bond], 2100, 971267).scheduledBonds[0].activationHeight).toBe(974750);
});
