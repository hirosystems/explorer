import ClarityIcon from '@/ui/icons/ClarityIcon';
import TransferIcon from '@/ui/icons/TransferIcon';
import { ArrowsLeftRight, Cube, PhoneCall, PlusMinus, Question } from '@phosphor-icons/react';
import BigNumber from 'bignumber.js';
import { c32addressDecode } from 'c32check';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import updateLocale from 'dayjs/plugin/updateLocale';
import React from 'react';

import {
  ContractCallTransaction,
  MempoolContractCallTransaction,
  MempoolTransaction,
  SmartContractTransaction,
  Transaction,
} from '@stacks/stacks-blockchain-api-types';

import { GenericResponseType } from '../hooks/useInfiniteQueryResult';
import { ContractCallTxs } from '../types/tx';

dayjs.extend(relativeTime);
dayjs.extend(updateLocale);
dayjs.updateLocale('en', {
  relativeTime: {
    future: 'in %s',
    past: (time: string) => {
      return time === 'Now' ? time : `${time} ago`;
    },
    s: 'Now',
    m: '1 min',
    mm: '%d mins',
    h: 'an hr',
    hh: '%d hrs',
    d: 'a day',
    dd: '%d days',
    M: 'a month',
    MM: '%d months',
    y: 'a year',
    yy: '%d years',
  },
});

export const MICROSTACKS_IN_STACKS = 1000000;

/**
 * validateStacksAddress
 *
 * @param {String} stacksAddress - the STX address to validate
 */
export const validateStacksAddress = (stacksAddress?: string): boolean => {
  try {
    if (!stacksAddress) return false;
    c32addressDecode(stacksAddress);
    return true;
  } catch (e) {
    return false;
  }
};

export const validateStacksContractId = (contractId?: string): boolean => {
  try {
    if (!contractId) return false;
    const [address, contract, ...rest] = contractId.split('.');
    if (!address || !contract) return false;
    if (rest.length > 0) return false;
    c32addressDecode(address);
    return true;
  } catch (e) {
    return false;
  }
};

export function shortenHexDeprecated(hex: string, length = 4) {
  return `${hex.substring(0, length + 2)}…${hex.substring(hex.length - length)}`;
}

export function truncateHex(
  input: string,
  startLength: number,
  endLength: number,
  includePrefix = true
) {
  if (!input) return '';

  if (!input.startsWith('0x')) {
    return input;
  }

  return `${input.substring(0, includePrefix ? startLength + 2 : startLength)}…${input.substring(
    input.length - endLength
  )}`;
}

/**
 * truncateMiddle
 *
 * @param {string} input - the string to truncate
 * @param {number} startLength - the number of chars to keep on the start
 * @param {number} endLength - the number of chars to keep on the end
 */
export const truncateMiddle = (input: string, startLength: number, endLength: number): string => {
  if (!input) return '';
  const start = input?.substring(0, startLength);
  const end = input?.substring(input.length - endLength, input.length);
  return `${start}…${end}`;
};

export const truncateContractName = (
  input: string,
  startLength?: number,
  endLength?: number
): string => {
  if (!input) return '';
  if (!startLength) return input;
  const truncatedContent = !endLength
    ? `${input?.substring(0, startLength)}...`
    : input?.substring(0, startLength) +
      '…' +
      input?.substring(input.length - endLength, input.length);
  if (truncatedContent.length > input.length) {
    return input;
  }
  return truncatedContent;
};

export const truncateStxAddress = (input: string, startLength = 4, endLength = 5): string => {
  if (!input || !validateStacksAddress(input)) return '';

  return truncateMiddle(input, startLength, endLength);
};

export const truncateStxContractId = (
  input: string,
  startLength = 4,
  endLength = 5,
  startContractLength?: number,
  endContractLength?: number
): string => {
  if (!input || !validateStacksContractId(input)) return '';

  const [address, contractName] = input.split('.');
  return `${truncateMiddle(address, startLength, endLength)}.${truncateContractName(
    contractName,
    startContractLength,
    endContractLength
  )}`;
};

/**
 * truncateMiddle
 *
 * @param {string} input - the string to truncate
 * @param {number} offset - the number of chars to keep on either end
 */
export const truncateMiddleDeprecated = (input: string, offset = 5, contractOffest = 0): string => {
  if (!input) return '';
  // hashes
  if (input.startsWith('0x')) {
    return shortenHexDeprecated(input, offset);
  }
  // for contracts
  if (input.includes('.')) {
    const parts = input.split('.');
    const start = parts[0]?.substring(0, offset);
    const end = parts[0]?.substring(parts[0].length - offset, parts[0].length);
    const contract =
      contractOffest && contractOffest < parts[1].length
        ? `${parts[1]?.substring(0, contractOffest)}...`
        : parts[1];
    return `${start}…${end}.${contract}`;
  } else {
    // everything else
    const start = input?.substring(0, offset);
    const end = input?.substring(input.length - offset, input.length);
    return `${start}…${end}`;
  }
};

export function truncateText(text: string, limit: number) {
  if (text.length <= limit) {
    return text;
  }
  const cutOffPoint = limit - 3;
  const truncatedText = text.substring(0, cutOffPoint) + '...';
  return truncatedText;
}

export const formatStacksAmount = (amountInStacks: string | number): string => {
  return amountInStacks.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 6,
  });
};

export const microToStacks = (amountInMicroStacks: string | number): number => {
  return Number(Number(amountInMicroStacks) / Math.pow(10, 6));
};

export const microToStacksFormatted = (amountInMicroStacks: string | number): string => {
  return formatStacksAmount(microToStacks(amountInMicroStacks));
};

/**
 * @param stxAmount - the amount of stacks (or microstacks) to convert to a USD price
 * @param stxPrice - the current USD price of STX
 * @param isInMicroStacks - if true, the stxAmount is in microstacks
 *
 * @returns string - the formatted current USD price of the given STX
 */
export const getUsdValue = (
  stxAmount: number,
  stxPrice: number,
  isInMicroStacks = false
): string => {
  if (!stxPrice) return 'N/A';
  const amountInStx = isInMicroStacks ? microToStacks(stxAmount) : stxAmount;
  const price = amountInStx * stxPrice;
  return price > 0 && price < 0.01 ? '<$0.01' : usdFormatter.format(price);
};

/**
 * stacksToMicro
 *
 * @param {String || Number} amountInStacks - the amount of stacks to convert
 */
export const stacksToMicro = (amountInStacks: string | number) =>
  amountInStacks ? Math.floor(Number(amountInStacks) * MICROSTACKS_IN_STACKS) : 0;

export const getContractName = (fullyRealizedName: string): string =>
  fullyRealizedName?.split('.')[1];

export const getFunctionName = (tx: ContractCallTxs) => {
  return tx.contract_call.function_name;
};
export const getFungibleAssetName = (fullyRealizedName: string): string =>
  getContractName(fullyRealizedName)?.split('::')[1];

export const getAssetNameParts = (fullyRealizedName: string) => {
  const address = fullyRealizedName.split('.')[0];
  const contract = getContractName(fullyRealizedName).split('::')[0];
  const asset = getFungibleAssetName(fullyRealizedName);

  return {
    address,
    contract,
    asset,
  };
};

export const getMemoString = (string: string): string | null =>
  string
    ? Buffer.from(string.replace('0x', '').replace(/^(0{2})+|(0{2})+$/g, ''), 'hex').toString(
        'utf8'
      )
    : null;

export const addSepBetweenStrings = (strings: (string | undefined)[], sep = '∙'): string => {
  let str = '';
  strings
    .filter(_s => _s)
    .forEach((string, index, array) => {
      if (index < array.length - 1) {
        str += (string as string) + ` ${sep} `;
      } else {
        str += string;
      }
    });
  return str;
};

export const toRelativeTime = (ts: number): string => dayjs().to(ts);

export function isPendingTx(tx: MempoolTransaction | Transaction) {
  const statuses = [
    'pending',
    'dropped_replace_by_fee',
    'dropped_replace_across_fork',
    'dropped_too_expensive',
    'dropped_stale_garbage_collect',
  ];

  return statuses.includes(tx.tx_status);
}

export function stringToHslColor(str: string, saturation: number, lightness: number): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }

  const hue = hash % 320;
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}

export const onPaste = (
  event: React.ClipboardEvent<HTMLInputElement>,
  callback: (string: string) => any
) => {
  if (typeof navigator === 'undefined' || typeof window === 'undefined') return;
  if (event.clipboardData) {
    callback(event.clipboardData.getData('text/plain'));
  } else if ((window as any).clipboardData) {
    callback((window as any).clipboardData.getData('Text'));
  }
};

export const capitalize = (s: string) => {
  return s?.charAt(0).toUpperCase() + s?.slice(1);
};

export function isReactComponent(Comp: any) {
  return (
    (Comp && typeof Comp === 'object' && `$$typeof` in Comp) || (Comp && typeof Comp === 'function')
  );
}

export function initBigNumber(num: string | number | BigNumber) {
  return BigNumber.isBigNumber(num) ? num : new BigNumber(num);
}

export const getFtDecimalAdjustedBalance = (
  value: number | string | BigNumber,
  decimals: number
): number => {
  return initBigNumber(value).shiftedBy(-decimals).toNumber();
};

export const ftDecimals = (value: number | string | BigNumber, decimals: number) => {
  return getFtDecimalAdjustedBalance(value, decimals).toLocaleString('en-US', {
    maximumFractionDigits: decimals,
  });
};

export function getLocaleDecimalSeparator() {
  return Intl.NumberFormat()
    .formatToParts(1.1)
    .find(part => part.type === 'decimal')?.value;
}

export function getTxContractId(
  tx: ContractCallTransaction | MempoolContractCallTransaction | SmartContractTransaction // not MempoolSmartContractTransaction, as the contract won't be deployed yet
): string;
export function getTxContractId(tx: Transaction | MempoolTransaction): string | undefined;

export function getTxContractId(tx: Transaction | MempoolTransaction) {
  if (tx.tx_type === 'smart_contract' && tx.tx_status === 'success') {
    return tx.smart_contract.contract_id;
  }
  if (tx.tx_type === 'contract_call') {
    return tx.contract_call.contract_id;
  }
}

export const usdFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

export function isNumeric(value: string): boolean {
  return /^-?\d+$/.test(value);
}

export const hexToString = (input?: string) => {
  if (!input) return '';
  const hex = input.toString();
  let str = '';
  for (let i = 0; i < hex.length; i += 2)
    str += String.fromCharCode(parseInt(hex.slice(i, i + 2), 16));
  return str;
};

export function getNextPageParam(lastPage?: GenericResponseType<any>) {
  if (!lastPage) return 0;
  const { limit, offset, total } = lastPage;
  const sum = offset + limit;
  const delta = total - sum;
  const isAtEnd = delta <= 0;
  if (isAtEnd) return undefined;
  return sum;
}

const maxDecimals = 20; // just some arbitrarily large number to preserve precision
const formatNumber = (num: number, divisor: number, suffix: string, decimals?: number) => {
  // If decimals is undefined, don't limit decimal places
  if (decimals == null) {
    return `${(num / divisor)
      .toLocaleString(undefined, { maximumFractionDigits: maxDecimals })
      .replace(/\.0+$/, '')}${suffix}`;
  }

  if (num < 1 / Math.pow(10, decimals)) {
    const magnitude = Math.ceil(Math.abs(Math.log10(num))); // find the magnitude of the number, ie the # of decimal places needed to reach the first significant digit
    return num.toFixed(magnitude + decimals - 1).replace(/\.0+$/, ''); // add decimals - 1 to get the correct number of decimal places
  }

  // Remove trailing zeros and decimal point if all decimals are zero
  return `${parseFloat((num / divisor).toFixed(decimals))
    .toLocaleString(undefined, { maximumFractionDigits: maxDecimals })
    .replace(/\.0+$/, '')}${suffix}`;
};

export const abbreviateNumber = (value: number, decimals?: number) => {
  const mil = 1e6;
  const bil = 1e9;
  const tril = 1e12;
  const quadril = 1e15;

  if (value >= quadril) {
    return formatNumber(value, quadril, 'Q', 2);
  }
  if (value >= tril) {
    return formatNumber(value, tril, 'T', 2);
  }
  if (value >= bil) {
    return formatNumber(value, bil, 'B', 2);
  }
  if (value >= mil) {
    return formatNumber(value, mil, 'M', 2);
  }

  return formatNumber(value, 1, '', decimals);
};

export function microStxToStx(microStx: string | number): number | string {
  return Number(Number(microStx) / Math.pow(10, 6));
}

export const isJSONString = (str: string) => {
  try {
    JSON.parse(str);
    return true;
  } catch (error) {
    return false;
  }
};

export const getTxTitle = (transaction: Transaction | MempoolTransaction) => {
  switch (transaction.tx_type) {
    case 'smart_contract':
      return getContractName(transaction?.smart_contract?.contract_id);
    case 'contract_call':
      return getFunctionName(transaction);
    case 'token_transfer':
      return `${microToStacksFormatted(transaction.token_transfer.amount)} STX transfer`;
    case 'coinbase':
      return 'block_height' in transaction && transaction?.block_height
        ? `Block #${transaction.block_height} coinbase`
        : 'Coinbase';
    case 'poison_microblock':
      return `Poison microblock transaction`;
    case 'tenure_change':
      return `Tenure change`;
  }
};

export function removeTrailingSlash(url?: string) {
  if (!url) return '';
  return url.replace(/\/$/, '');
}

export function promiseWrapper<T, Args extends any[]>(
  func: (...args: Args) => T | Promise<T>
): (...args: Args) => Promise<T> {
  return function (...args: Args): Promise<T> {
    return new Promise((resolve, reject) => {
      try {
        const result = func(...args);
        resolve(result);
      } catch (error) {
        reject(error);
      }
    });
  };
}

export function getTxTypeIcon(txType: string) {
  switch (txType) {
    case 'token_transfer':
      return <TransferIcon />;
    case 'contract_call':
      return <PhoneCall />;
    case 'smart_contract':
      return <ClarityIcon />;
    case 'tenure_change':
      return <Cube />;
    case 'all':
      return <PlusMinus weight="bold" />;
    default:
      return <Question />;
  }
}

export function getTxTypeLabel(txType: string) {
  switch (txType) {
    case 'token_transfer':
      return 'Token Transfer';
    case 'contract_call':
      return 'Contract Call';
    case 'smart_contract':
      return 'Contract Deploy';
    case 'tenure_change':
      return 'Tenure Change';
    case 'coinbase':
      return 'Coinbase';
    case 'all':
      return 'Average';
    default:
      return 'Unknown';
  }
}

export function getTxTypeColor(txType: string) {
  switch (txType) {
    case 'token_transfer':
      return 'transactionTypes.tokenTransfer';
    case 'contract_call':
      return 'transactionTypes.contractCall';
    case 'smart_contract':
      return 'transactionTypes.contractDeploy';
    case 'tenure_change':
      return 'transactionTypes.tenureChange';
    case 'coinbase':
      return 'transactionTypes.coinbase';
    default:
      return 'transactionTypes.tokenTransfer';
  }
}

function toKebabCase(str: string) {
  return str
    .replace(/\./g, '-')
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .toLowerCase();
}

export function semanticTokenToCssVar(token: string): string {
  if (!token) return '';
  const kebabCase = toKebabCase(token);
  return `var(--stacks-colors-${kebabCase})`;
}
