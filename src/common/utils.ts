import engine from 'store/src/store-engine';
import lclStorage from 'store/storages/localStorage';
import { c32addressDecode } from 'c32check';

export const store = engine.createStore([lclStorage]);

/**
 * validateStacksAddress
 *
 * @param {String} stacksAddress - the STX address to validate
 */
const validateStacksAddress = (stacksAddress: string) => {
  let valid = false;
  try {
    if (c32addressDecode(stacksAddress)) {
      valid = true;
    }
  } catch (e) {
    throw new Error('Not a valid Stacks address.');
  }
  return valid;
};

export const dedupe = (array: any[], key: string) =>
  Array.from(new Set(array.map(a => a[key]))).map(id => {
    return array.find(a => a[key] === id);
  });

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

export const truncateMiddle = (input: string, offset = 5) => {
  const start = input.substr(0, offset);
  const end = input.substr(input.length - offset, input.length);
  return `${start}…${end}`;
};

export const validateTxId = (txid: string) => {
  const regex = /0x[A-Fa-f0-9]{64}/;
  return regex.exec(txid);
};

export const validateContractName = (contract: string) => {
  const stxAddress = contract.split('.')[0];
  const contractName = contract.split('.')[1];
  const nameRegex = /[a-zA-Z]([a-zA-Z0-9]|[-_!?+<>=/*])*$|^[-+=/*]$|^[<>]=?$/;
  const validStacksAddress = validateStacksAddress(stxAddress);
  const validName = nameRegex.exec(contractName);
  return validName && validStacksAddress;
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
