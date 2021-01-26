import {
  callReadOnlyFunction,
  cvToHex,
  cvToJSON,
  cvToString,
  deserializeCV,
  encodeClarityValue,
  tupleCV,
  uintCV,
} from '@stacks/transactions';
import { microStxToStx } from '@stacks/ui-utils';
import { Configuration, SmartContractsApi } from '@stacks/blockchain-api-client';
import { POX_ADDRESS } from '@common/constants';
import { convertPoxAddressToBtc } from '@common/btc';
import { NetworkModes } from '@common/types/network';

const config = new Configuration({
  fetchApi: fetch,
  basePath: 'https://stacks-node-api.mainnet.stacks.co',
});

const client = new SmartContractsApi(config);

export async function getTotalStacked(cycle: number): Promise<number | undefined> {
  try {
    const readonly = await callReadOnlyFunction({
      contractAddress: POX_ADDRESS,
      contractName: 'pox',
      functionName: 'get-total-ustx-stacked',
      functionArgs: [encodeClarityValue('uint128', cycle.toString())],
      senderAddress: POX_ADDRESS,
    });
    const currentlyStacked = microStxToStx(parseInt(cvToString(readonly).replace('u', '')));
    return currentlyStacked as number;
  } catch (e) {
    console.error(e.message);
  }
}

export async function getRewardCycleLength(rewardCycle?: number) {
  try {
    const cycle = uintCV(rewardCycle || 1);
    const tuple = tupleCV({
      ['reward-cycle']: cycle,
    });
    const key = cvToHex(tuple);
    const data = await client.getContractDataMapEntry({
      contractAddress: 'SP000000000000000000002Q6VF78',
      contractName: 'pox',
      mapName: 'reward-cycle-pox-address-list-len',
      key,
    });
    const d = deserializeCV(Buffer.from(data.data.replace('0x', ''), 'hex'));
    const cv = cvToJSON(d);
    return cv.value.value.len.value;
  } catch (e) {
    console.log(e.message);
  }
}

export async function getPoxAddr(options: { index: number; cycle: number }) {
  try {
    const index = uintCV(options.index);
    const cycle = uintCV(options.cycle);
    const tuple = tupleCV({
      ['index']: index,
      ['reward-cycle']: cycle,
    });
    const hex = cvToHex(tuple);
    const data = await client.getContractDataMapEntry({
      contractAddress: 'SP000000000000000000002Q6VF78',
      contractName: 'pox',
      mapName: 'reward-cycle-pox-address-list',
      key: hex,
      proof: 0,
    });
    const d = deserializeCV(Buffer.from(data.data.replace('0x', ''), 'hex'));
    const cv = cvToJSON(d);
    const addr = cv.value.value['pox-addr'];
    const total = cv.value.value['total-ustx'];
    const hashbytes = Buffer.from(addr.value.hashbytes.value.replace('0x', ''), 'hex');
    const version = Buffer.from(addr.value.version.value.replace('0x', ''), 'hex');
    const btc = convertPoxAddressToBtc(NetworkModes.Mainnet)({
      hashbytes,
      version,
    });
    return {
      pox_addr: btc,
      total_locked: microStxToStx(total.value),
    };
  } catch (e) {
    console.log(e.message);
  }
}

export async function getPoxAddrForRewardCycle(rewardCycle: number) {
  try {
    const length = await getRewardCycleLength(rewardCycle);
    const arr = Array.from(Array(length).keys());
    const promises = arr.map(index =>
      getPoxAddr({
        index,
        cycle: 1,
      })
    );
    const data = await Promise.all(promises);
    return data;
  } catch (e) {
    console.log(e.message);
  }
}
