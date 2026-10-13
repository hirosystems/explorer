import type { Bond, BondRewards } from './data';
import { toBigInt } from './utils';

function sumKnown(values: (bigint | undefined)[]): bigint | undefined {
  let total = BigInt(0);
  for (const value of values) {
    if (value === undefined || value < BigInt(0)) return undefined;
    total += value;
  }
  return total;
}

function getLastDistribution(
  active: Bond[],
  settlementsByBond?: BondRewards['settlementsByBond']
): { sats: bigint | undefined; timestampMs: number | null | undefined } | undefined {
  const histories = active.map(bond => settlementsByBond?.[bond.index]);
  if (histories.some(history => history === undefined)) return undefined;

  const distributions = histories.flatMap(history => history ?? []);
  if (!distributions.length) return { sats: BigInt(0), timestampMs: null };
  if (
    distributions.some(
      entry => !Number.isSafeInteger(entry.calculationHeight) || entry.calculationHeight < 0
    )
  )
    return undefined;

  const latestHeight = distributions.reduce(
    (height, entry) => Math.max(height, entry.calculationHeight),
    0
  );
  // Use one shared distribution, rather than each bond's potentially older latest payment.
  const sats = sumKnown(
    histories.map(history => {
      const latest = history!.filter(entry => entry.calculationHeight === latestHeight);
      if (!latest.length) return BigInt(0);
      const amount = latest[0].rewardedSats;
      // Repeated records for the same calculation must agree and count only once.
      return latest.every(entry => entry.rewardedSats === amount) ? amount : undefined;
    })
  );
  const timestamps = distributions
    .filter(entry => entry.calculationHeight === latestHeight)
    .map(entry => entry.timestampMs);
  const timestampMs = timestamps.every(time => Number.isFinite(time) && time > 0)
    ? Math.max(...timestamps)
    : undefined;
  return { sats, timestampMs };
}

export function getActiveBondSummary(
  bonds: Bond[],
  settlementsByBond?: BondRewards['settlementsByBond']
) {
  const active = bonds.filter(bond => bond.status === 'active');
  const lastDistribution = getLastDistribution(active, settlementsByBond);
  const rates = active.map(bond => bond.parameters?.target_rate_bps);
  const averageTargetRateBps =
    rates.length &&
    rates.every(rate => typeof rate === 'number' && Number.isFinite(rate) && rate >= 0)
      ? rates.reduce((sum, rate) => sum + rate, 0) / rates.length
      : undefined;

  return {
    count: active.length,
    averageTargetRateBps,
    bondedSats: sumKnown(active.map(bond => toBigInt(bond.balances?.locked?.btc))),
    pairedMicroStx: sumKnown(active.map(bond => toBigInt(bond.balances?.locked?.stx))),
    lastDistributionSats: lastDistribution?.sats,
    lastDistributionTimestampMs: lastDistribution?.timestampMs,
  };
}
