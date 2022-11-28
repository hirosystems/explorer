/** @jsxRuntime classic */
import { Box, color, ColorsStringLiteral, Flex, Stack } from '@stacks/ui';
import {
  CoreNodeInfoResponse,
  MempoolTransaction,
  Transaction,
} from '@stacks/stacks-blockchain-api-types';
import { c32addressDecode } from 'c32check';
import dayjs from 'dayjs';

import relativeTime from 'dayjs/plugin/relativeTime';
import { ContractCallTxs } from '@common/types/tx';
import { Text } from '@components/typography';
import { IconArrowLeft } from '@tabler/icons';
import { TESTNET_CHAIN_ID } from '@common/constants';
import { Network, NetworkMode, NetworkModes } from '@common/types/network';
import { NextPageContext } from 'next';
import BigNumber from 'bignumber.js';
import React from 'react';
import { StxPriceButton } from '@modules/stxPrice/StxPriceButton';
import { CustomNetworksLSKey } from '@common/constants/network';

dayjs.extend(relativeTime);

const MICROSTACKS_IN_STACKS = 1000000;

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

/**
 * dedupe
 *
 * @param {array} array - the array to remove duplicate items
 * @param {string} key - the key to check by for dupes, typically an id of some sort
 */
export const dedupe = (array: any[], key: string): any[] =>
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  Array.from(new Set(array.map(a => a[key]))).map(id => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return array.find(a => a[key] === id);
  });

/**
 * toKebabCase
 *
 * @param {string} str - string to convert_this orThis to convert-this or-this
 */
export const toKebabCase = (str: string): string => {
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

export function shortenHex(hex: string, length = 4) {
  return `${hex.substring(0, length + 2)}…${hex.substring(hex.length - length)}`;
}

/**
 * truncateMiddle
 *
 * @param {string} input - the string to truncate
 * @param {number} offset - the number of chars to keep on either end
 */
export const truncateMiddle = (input: string, offset = 5): string => {
  if (!input) return '';
  // hashes
  if (input.startsWith('0x')) {
    return shortenHex(input, offset);
  }
  // for contracts
  if (input.includes('.')) {
    const parts = input.split('.');
    const start = parts[0]?.substr(0, offset);
    const end = parts[0]?.substr(parts[0].length - offset, parts[0].length);
    return `${start}…${end}.${parts[1]}`;
  } else {
    // everything else
    const start = input?.substr(0, offset);
    const end = input?.substr(input.length - offset, input.length);
    return `${start}…${end}`;
  }
};

/**
 * validateTxId
 *
 * @param {string} tx_id - the tx_id sha hash to validate
 */
export const validateTxId = (tx_id: string): any => {
  const regex = /0x[A-Fa-f0-9]{64}/;
  const matches = regex.exec(tx_id);

  return matches?.[0] === tx_id;
};

/**
 * validateContractName
 *
 * @param {string} contractString - the fully realized contract name to validate, ex: ST2ZRX0K27GW0SP3GJCEMHD95TQGJMKB7G9Y0X1MH.hello-world-contract
 */
export const validateContractName = (contractString: string): boolean => {
  if (!contractString.includes('.')) return false;

  const stxAddress = contractString.split('.')[0];
  const contractName = contractString.split('.')[1];
  const nameRegex = /[a-zA-Z]([a-zA-Z0-9]|[-_!?+<>=/*])*$|^[-+=/*]$|^[<>]=?$/;
  try {
    const validStacksAddress = validateStacksAddress(stxAddress);
    const validName = nameRegex.exec(contractName);
    return !!(validName && validStacksAddress);
  } catch (e) {
    return false;
  }
};

export const queryWith0x = (query: string): string =>
  query.includes('.') ? query : !query.includes('0x') ? '0x' + query : query;

export const handleTxIdValidation = (query?: string): { success: boolean; message?: string } => {
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

  if (validateTxId(query)) {
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

export const formatStacksAmount = (amountInStacks: number): string => {
  return amountInStacks.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 6,
  });
};

/**
 * microToStacks
 *
 * @param {Number} amountInMicroStacks - the amount of microStacks to convert
 * @param {Number} localString - big pretty print if true
 */
export const microToStacks = (
  amountInMicroStacks: string | number,
  localString = true
): number | string => {
  const value = Number(Number(amountInMicroStacks) / Math.pow(10, 6));
  if (localString) {
    return formatStacksAmount(value);
  }
  return value;
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
  const amountInStx = isInMicroStacks ? (microToStacks(stxAmount, false) as number) : stxAmount;
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

export const startPad = (n: number, z = 2, s = '0'): string =>
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
  (n + '').length <= z ? ['', '-'][+(n < 0)] + (s.repeat(z) + Math.abs(n)).slice(-1 * z) : n + '';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const clarityValuetoHumanReadable = (value: any): string | null => {
  return (value && value.repr) || null;
};

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
  const statuses =
    'pending' ||
    'dropped_replace_by_fee' ||
    'dropped_replace_across_fork' ||
    'dropped_too_expensive' ||
    'dropped_stale_garbage_collect';

  return tx.tx_status === statuses;
}

export const assertConfirmedTransaction = (
  tx?: MempoolTransaction | Transaction
): Transaction | undefined =>
  tx ? (isPendingTx(tx) ? undefined : (tx as Transaction)) : undefined;

export const border = (
  _color: ColorsStringLiteral = 'border',
  width = 1,
  style = 'solid'
): string => `${width}px ${style} ${color(_color)}`;

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
    // used in some browsers for clipboardData
    callback(event.clipboardData.getData('text/plain'));
  } else if ((window as any).clipboardData) {
    // Older clipboardData version for Internet Explorer only
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    callback((window as any).clipboardData.getData('Text'));
  }
};

const ContractName = ({ fn, contract }: any) => {
  return (
    <Stack alignItems="center" spacing="tight" isInline>
      <Box as="span">{fn}</Box>
      <Box color={color('text-caption')} height="14px">
        <IconArrowLeft size="14px" />
      </Box>
      <Box fontSize="12px" color={color('text-caption')} as="span">
        {contract}
      </Box>
    </Stack>
  );
};

export const getTxTitle = (transaction: Transaction | MempoolTransaction, showPrice?: boolean) => {
  switch (transaction.tx_type) {
    case 'smart_contract':
      return getContractName(transaction?.smart_contract?.contract_id);
    case 'contract_call':
      return (
        <ContractName
          fn={getFunctionName(transaction)}
          contract={getContractName(transaction.contract_call.contract_id)}
        />
      );
    case 'token_transfer':
      return (
        <Flex
          flexDirection={['column', 'column', 'row']}
          alignItems={['flex-start', 'flex-start', 'center']}
        >
          <Text>{microToStacks(transaction.token_transfer.amount)} STX</Text>
          {showPrice && (
            <StxPriceButton tx={transaction} value={Number(transaction.token_transfer.amount)} />
          )}
        </Flex>
      );
    case 'coinbase':
      return `Block #${(transaction as Transaction).block_height} coinbase`;
    default:
      return truncateMiddle(transaction.tx_id, 10);
  }
};

export const capitalize = (s: string) => {
  return s?.charAt(0).toUpperCase() + s?.slice(1);
};

export const isLocal = () => {
  if (typeof document !== 'undefined') {
    if (document.location.hostname === '127.0.0.1' || document.location.hostname === 'localhost') {
      return true;
    }
  }
  return false;
};

export const getInvertedChainMode = (mode: NetworkModes) =>
  mode === 'testnet' ? 'mainnet' : 'testnet';

export const getChainIdFromInfo = (data: CoreNodeInfoResponse): NetworkMode | undefined => {
  const networkId = data?.network_id;

  return networkId
    ? TESTNET_CHAIN_ID === networkId
      ? NetworkModes.Testnet
      : NetworkModes.Mainnet
    : undefined;
};

export function isReactComponent(Comp: any) {
  return (
    (Comp && typeof Comp === 'object' && `$$typeof` in Comp) || (Comp && typeof Comp === 'function')
  );
}

export const getTxIdFromCtx = (ctx: NextPageContext) =>
  ctx?.query?.txid ? queryWith0x(ctx.query?.txid.toString()) : '';

export const getContractIdFromTx = (tx?: Transaction | MempoolTransaction) => {
  if (!tx) return;
  let contractId;
  if (tx.tx_type === 'contract_call') contractId = tx.contract_call.contract_id;
  if (tx.tx_type === 'smart_contract') contractId = tx.smart_contract.contract_id;
  return contractId;
};

export function initBigNumber(num: string | number | BigNumber) {
  return BigNumber.isBigNumber(num) ? num : new BigNumber(num);
}

export const ftDecimals = (value: number | string | BigNumber, decimals: number) => {
  return initBigNumber(value)
    .shiftedBy(-decimals)
    .toNumber()
    .toLocaleString('en-US', { maximumFractionDigits: decimals });
};

export const ftUnshiftDecimals = (value: number | string | BigNumber, decimals: number) => {
  return initBigNumber(value).shiftedBy(decimals).toString(10);
};

export function getLocaleDecimalSeparator() {
  return Intl.NumberFormat()
    .formatToParts(1.1)
    .find(part => part.type === 'decimal')?.value;
}

export const removeKeysWithUndefinedValues = (obj: Record<string, any>) =>
  JSON.parse(JSON.stringify(obj));

export function getContractId(
  txPageQuery?: string,
  transaction?: Transaction | MempoolTransaction
) {
  if (!txPageQuery || !transaction) return;
  const isContract = txPageQuery.includes('.');
  return isContract
    ? txPageQuery
    : transaction?.tx_type === 'smart_contract'
    ? transaction.smart_contract.contract_id
    : transaction?.tx_type === 'contract_call'
    ? transaction.contract_call.contract_id
    : undefined;
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

export function getNextPageParam(options?: { limit: number; offset: number; total: number }) {
  if (!options) return 0;
  const { limit, offset, total } = options;
  const sum = offset + limit;
  const delta = total - sum;
  const isAtEnd = delta === 0 || Math.sign(delta) === -1;
  if (Math.abs(delta) === sum || isAtEnd) return undefined;
  return sum;
}

export const getCustomNetworksFromLS = () => {
  try {
    return JSON.parse(localStorage.getItem(CustomNetworksLSKey) || '{}') as Record<string, Network>;
  } catch (_) {
    return {};
  }
};
