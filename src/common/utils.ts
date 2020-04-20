import engine from 'store/src/store-engine';
import lclStorage from 'store/storages/localStorage';
import { c32addressDecode } from 'c32check';

export const store = engine.createStore([lclStorage]);

/**
 * validateStacksAddress
 *
 * @param {String} stacksAddress - the STX address to validate
 */
const validateStacksAddress = (stacksAddress: string) => !!c32addressDecode(stacksAddress);

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
