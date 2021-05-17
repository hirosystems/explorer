import type { NextApiRequest, NextApiResponse } from 'next';
import DATA from './data.json';
import LOCKUP from './lockups.json';
import {
  addressConvert,
  fetchCurrentStacksBlock,
  fetchLegacyExplorerVestingData,
} from '@common/utils/addresses';
import BN from 'bn.js';
import { HIRO_HEADERS } from '@common/constants';

const addresses = new Set(DATA);

interface LockupData {
  [key: string]: {
    [key: string]: number;
  };
}

async function fetchActualBalance(address: string) {
  try {
    const res = await fetch(`https://stacks-node-api.stacks.co/v2/accounts/${address}?proof=0`, {
      headers: HIRO_HEADERS,
    });
    return res.json();
  } catch (e) {
    throw Error(`Can't fetch actual balance: ${e.message}`);
  }
}

async function fetchAverageBlockTime() {
  const res = await fetch('https://blockchain.info/q/interval');
  return res.text();
}

export type VestingAddressData =
  | {
      found: true;
      data: { [key: string]: number };
      balance: string;
      currentHeight: number;
      lockedBalance: number;
      averageBlockTime: string;
      originalTotal: number | null;
    }
  | { found: false }
  | { error: string };

export default async function vestingAddressHandler(
  { query: { address } }: NextApiRequest,
  res: NextApiResponse<VestingAddressData>
) {
  try {
    if (address && typeof address === 'string') {
      const result = addressConvert(address);

      const found = addresses.has(result.mainnet.BTC || result.mainnet.STACKS);
      const data = (LOCKUP as LockupData)[result.mainnet.BTC];

      if (found) {
        const [coreNodeData, currentHeight, legacyData, averageBlockTime] = await Promise.all([
          fetchActualBalance(result.mainnet.STACKS),
          fetchCurrentStacksBlock(),
          fetchLegacyExplorerVestingData(result.mainnet.STACKS),
          fetchAverageBlockTime(),
        ]);

        const lockedBalance = Object.entries(data).reduce((acc, [height, amount]) => {
          if (parseInt(height) > currentHeight) return acc + amount;
          return 0;
        }, 0);

        const balance = new BN(coreNodeData.balance.replace('0x', ''), 'hex').toString();
        res.status(200).json({
          found: true,
          data,
          balance,
          lockedBalance,
          currentHeight,
          averageBlockTime,
          originalTotal: legacyData?.formattedUnlockTotal ?? null,
        });
      } else {
        res.status(404).json({ found: false });
      }
    } else {
      res.status(404).json({ found: false });
    }
  } catch (e) {
    res.status(404).json({ error: e.message });
  }
}
