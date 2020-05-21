import React from 'react';
import engine from 'store/src/store-engine';
import lclStorage from 'store/storages/localStorage';
import cookieStorage from 'store/storages/cookieStorage';
import { c32addressDecode } from 'c32check';
import { deserializeCV, addressToString } from '@blockstack/stacks-transactions';
import { fetchTxList } from '@common/api/transactions';
import Router from 'next/router';
import BN from 'bn.js';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);

export const store = engine.createStore([lclStorage]);
export const identityStorage = engine.createStore([cookieStorage]);

export const COLOR_MODE_COOKIE = 'color_mode';
export const colorModeStorage = engine.createStore([cookieStorage]);
export const NETWORK_COOKIE = 'selected_network';
export const networkStorage = engine.createStore([cookieStorage]);

/**
 * validateStacksAddress
 *
 * @param {String} stacksAddress - the STX address to validate
 */
export const validateStacksAddress = (stacksAddress: string) => {
  try {
    c32addressDecode(stacksAddress);
    return true;
  } catch (e) {
    return false;
  }
};

/**
 * dedupe
 *
 * @param {array} array - the array to remove duplicate items
 * @param {string} key - the key to check by for dupes, typically an id of some sort
 */
export const dedupe = (array: any[], key: string) =>
  Array.from(new Set(array.map(a => a[key]))).map(id => {
    return array.find(a => a[key] === id);
  });

/**
 * toKebabCase
 *
 * @param {string} str - string to convert_this orThis to convert-this or-this
 */
export const toKebabCase = (str: string) => {
  if (!str) return '';
  const hasSpaces = str.includes(' ');
  const hasUnderscore = str.includes('_');
  let string = str;
  if (hasSpaces) {
    string = string.replace(' ', '-');
  }
  if (hasUnderscore) {
    string = string.replace('_', '-');
  }

  return string.toLowerCase();
};

/**
 * truncateMiddle
 *
 * @param {string} input - the string to truncate
 * @param {number} offset - the number of chars to keep on either end
 */
export const truncateMiddle = (input: string, offset = 5) => {
  if (!input) return;
  const start = input.substr(0, offset);
  const end = input.substr(input.length - offset, input.length);
  return `${start}…${end}`;
};

/**
 * validateTxId
 *
 * @param {string} tx_id - the tx_id sha hash to validate
 */
export const validateTxId = (tx_id: string) => {
  const regex = /0x[A-Fa-f0-9]{64}/;
  return regex.exec(tx_id);
};

/**
 * validateContractName
 *
 * @param {string} contractString - the fully realized contract name to validate, ex: ST2ZRX0K27GW0SP3GJCEMHD95TQGJMKB7G9Y0X1MH.hello-world-contract
 */
export const validateContractName = (contractString: string) => {
  if (!contractString.includes('.')) return false;

  const stxAddress = contractString.split('.')[0];
  const contractName = contractString.split('.')[1];
  const nameRegex = /[a-zA-Z]([a-zA-Z0-9]|[-_!?+<>=/*])*$|^[-+=/*]$|^[<>]=?$/;
  try {
    const validStacksAddress = validateStacksAddress(stxAddress);
    const validName = nameRegex.exec(contractName);
    return validName && validStacksAddress;
  } catch (e) {
    return false;
  }
};

export const queryWith0x = (query: string) => (!query.includes('0x') ? '0x' + query : query);

export const handleValidation = (query?: string) => {
  if (!query || !query.trim().length) {
    return {
      success: false,
      message: 'No query provided',
    };
  }

  if (query.includes('.') && validateContractName(query)) {
    return {
      success: true,
    };
  }

  if (query.includes('.') && !validateContractName(query)) {
    return {
      success: false,
      message: 'Contract name seems invalid.',
    };
  }

  if (validateTxId(queryWith0x(query))) {
    return {
      success: true,
    };
  } else {
    return {
      success: false,
      message: 'Transaction ID hash seems invalid.',
    };
  }
};

/**
 * microToStacks
 *
 * @param {Number} amountInMicroStacks - the amount of microStacks to convert
 */
export const microToStacks = (amountInMicroStacks: string | number) =>
  amountInMicroStacks ? Number(amountInMicroStacks) / Math.pow(10, 6) : 0;

export const getContractName = (fullyRealizedName: string) => fullyRealizedName.split('.')[1];
export const getFungibleAssetName = (assetName: string) =>
  getContractName(assetName).split('::')[1];

export const getMemoString = (string: string) =>
  string ? Buffer.from(string.replace('0x', ''), 'hex').toString('utf8') : null;

export const startPad = (n: number, z = 2, s = '0') =>
  (n + '').length <= z ? ['', '-'][+(n < 0)] + (s.repeat(z) + Math.abs(n)).slice(-1 * z) : n + '';

export const navgiateToRandomTx = (apiServer: string) => async () => {
  const { results } = await fetchTxList(apiServer as string)();
  const hasNonCoinbaseTxs = results.some(tx => tx.tx_type !== 'coinbase');

  if (hasNonCoinbaseTxs) {
    const nonCoinbaseResults = results.filter(tx => tx.tx_type !== 'coinbase');
    const randomNonCoinbaseTx =
      nonCoinbaseResults[Math.floor(Math.random() * nonCoinbaseResults.length)];

    await Router.push('/txid/[txid]', `/txid/${randomNonCoinbaseTx.tx_id}`);

    return;
  }

  const randomTx = results[Math.floor(Math.random() * results.length)];
  await Router.push('/txid/[txid]', `/txid/${randomTx.tx_id}`);
};

export const clarityValuetoHumanReadable = (value: any) => {
  if (value && value.repr) {
    return value.repr;
  }
  return null;
  // const deserializeAsset = deserializeCV(Buffer.from(value.replace('0x', ''), 'hex'));
  //
  // if (deserializeAsset.type === 5 && 'address' in deserializeAsset) {
  //   return addressToString(deserializeAsset.address);
  // }
  // if (deserializeAsset.type === 1 && 'value' in deserializeAsset) {
  //   return (deserializeAsset.value as BN).toString();
  // }
  // if (deserializeAsset.type === 2 && 'buffer' in deserializeAsset) {
  //   return (deserializeAsset.buffer as Buffer).toString();
  // }
};

export const toRelativeTime = (ts: number) => dayjs().to(ts);
