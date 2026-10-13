import type { BondRewards } from './data';

export type BondRewardHistory = {
  index: number;
  rewardedSats: string;
  settlements: {
    calculationHeight: number;
    timestampMs: number;
    principalSats?: string;
    rewardedSats?: string;
  }[];
}[];

export function serializeBondRewards(rewards: BondRewards): BondRewardHistory {
  return Object.entries(rewards.byBondIndex).map(([index, rewardedSats]) => ({
    index: Number(index),
    rewardedSats: rewardedSats.toString(),
    settlements: rewards.settlementsByBond[Number(index)].map(entry => ({
      ...entry,
      principalSats: entry.principalSats?.toString(),
      rewardedSats: entry.rewardedSats?.toString(),
    })),
  }));
}

export function deserializeBondRewards(history: BondRewardHistory) {
  return {
    byBondIndex: Object.fromEntries(history.map(bond => [bond.index, BigInt(bond.rewardedSats)])),
    settlementsByBond: Object.fromEntries(
      history.map(bond => [
        bond.index,
        bond.settlements.map(entry => ({
          ...entry,
          principalSats:
            entry.principalSats === undefined ? undefined : BigInt(entry.principalSats),
          rewardedSats: entry.rewardedSats === undefined ? undefined : BigInt(entry.rewardedSats),
        })),
      ])
    ),
  };
}
