import { b58ToC32, c32address, c32addressDecode, c32ToB58, versions } from 'c32check';
import { DEPLOYMENT_URL, LEGACY_EXPLORER_API_SERVER } from '@common/constants';

export const C32_ADDRESS_CHARS = '[0123456789ABCDEFGHJKMNPQRSTVWXYZ]+';
export const STACKS_ADDRESS_PATTERN = `^(${C32_ADDRESS_CHARS})$`;
export const BTC_ADDRESS_PATTERN = /[123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz]+/;

type Networks = 'testnet' | 'mainnet';

type Versions =
  | typeof versions.testnet.p2pkh
  | typeof versions.testnet.p2sh
  | typeof versions.mainnet.p2pkh
  | typeof versions.mainnet.p2sh;

interface AddressDetails {
  version: Versions;
  network: Networks;
  type: 'p2pkh' | 'p2sh';
}

interface AddressResult {
  STACKS: string;
  BTC: string;
}

interface AddressesResult {
  mainnet: AddressResult;
  testnet: AddressResult;
}

/**
 * Get address details
 *
 * Takes a C32 address and provides more verbose details about type and network
 */
export function getAddressDetails(address: string): AddressDetails {
  const [version] = c32addressDecode(address);

  if (version === versions.testnet.p2pkh) {
    return {
      version,
      network: 'testnet',
      type: 'p2pkh',
    };
  } else if (version === versions.testnet.p2sh) {
    return {
      version,
      network: 'testnet',
      type: 'p2sh',
    };
  } else if (version === versions.mainnet.p2pkh) {
    return {
      version,
      type: 'p2pkh',
      network: 'mainnet',
    };
  } else if (version === versions.mainnet.p2sh) {
    return {
      version,
      type: 'p2sh',
      network: 'mainnet',
    };
  } else {
    throw new Error(`Unexpected address version: ${version}`);
  }
}

/**
 * Invert address
 *
 * Automatically invert address between testnet/mainnet
 */
export const invertAddress = (address: string): string => {
  const [version, hash160] = c32addressDecode(address);
  let _version = 0;
  if (version === versions.mainnet.p2pkh) {
    _version = versions.testnet.p2pkh;
  } else if (version === versions.mainnet.p2sh) {
    _version = versions.testnet.p2sh;
  } else if (version === versions.testnet.p2pkh) {
    _version = versions.mainnet.p2pkh;
  } else if (version === versions.testnet.p2sh) {
    _version = versions.mainnet.p2sh;
  } else {
    throw new Error(`Unexpected address version: ${version}`);
  }
  return c32address(_version, hash160);
};

/**
 * Convert address
 *
 * Converts a STACKS address to a given network mode (testnet/mainnet)
 */

export function convertAddress(address: string, network: 'testnet' | 'mainnet'): string {
  const details = getAddressDetails(address);
  if (details.network !== network) {
    return invertAddress(address);
  }
  return address;
}

/**
 * Get c32 address
 *
 * This will convert a BTC address to c32 if need be
 */
export function getC32Address(address: string) {
  const stacksRegex = RegExp(STACKS_ADDRESS_PATTERN);
  const btcRegex = RegExp(BTC_ADDRESS_PATTERN);
  let c32addr: string;
  if (stacksRegex.exec(address)?.[0] === address) {
    c32addr = address;
  } else if (btcRegex.exec(address)?.[0] === address) {
    c32addr = b58ToC32(address);
  } else {
    throw new Error(`Unrecognized address ${address}`);
  }

  return c32addr;
}

/**
 * Get address result
 *
 * Returns the STACKS and BTC addresses for a given c32 address
 * (wrapper to convert to BTC)
 */
function getAddressResult(address: string): AddressResult {
  return {
    STACKS: address,
    BTC: c32ToB58(address),
  };
}

/**
 * Address convert
 *
 * Converts any address into both testnet/mainnet variants.
 * Pass in a BTC address or STX address, testnet/mainnet :)
 */
export function addressConvert(address: string): AddressesResult {
  const c32Address = getC32Address(address);
  const mainnetSTX = convertAddress(c32Address, 'mainnet');
  const testnetSTX = convertAddress(c32Address, 'testnet');
  return {
    mainnet: getAddressResult(mainnetSTX),
    testnet: getAddressResult(testnetSTX),
  };
}

interface AddressVestingReturn {
  found: boolean;
}

export async function fetchAddressVesting(address: string): Promise<boolean> {
  try {
    const res = await fetch(`${DEPLOYMENT_URL}/api/vesting/${address}`);
    const data: AddressVestingReturn = await res.json();
    return data?.found;
  } catch (e) {
    return false;
  }
}

export interface VestingData {
  tokensGranted: number;
  totalLocked: number;
  totalLockedStacks: string;
  totalReceived: number;
  totalUnlocked: number;
  totalUnlockedStacks: string;
  unlockTotal: number;
  unlockTotalStacks: string;
  vestingTotal: number;
  vesting_total: number;
}

interface LegacyVestingDataResponse extends VestingData {
  address: string;
  balance: string;
  btcAddress: string;
  cumulativeVestedAtBlocks: Record<number, number>;
  formattedUnlockTotal: string;
  history: any[];
  status: {
    address: string;
    block_id: number;
    credit_value: string;
    debit_value: string;
    lock_transfer_block_id: number;
    txid: string;
    type: 'STACKS' | 'BTC';
    vtxindex: number;
  };
  tokens: ('STACKS' | 'BTC')[];
}

export async function fetchLegacyExplorerVestingData(address: string): Promise<any> {
  const convertedAddress = convertAddress(address, 'mainnet');
  try {
    const res = await fetch(
      `${LEGACY_EXPLORER_API_SERVER}/api/stacks/addresses/${convertedAddress}`
    );
    const data: LegacyVestingDataResponse = await res.json();
    if (data && !('success' in data)) {
      const {
        tokensGranted,
        totalLocked,
        totalLockedStacks,
        totalReceived,
        totalUnlocked,
        totalUnlockedStacks,
        unlockTotal,
        unlockTotalStacks,
        vestingTotal,
        vesting_total,
      } = data;
      return {
        tokensGranted,
        totalLocked,
        totalLockedStacks,
        totalReceived,
        totalUnlocked,
        totalUnlockedStacks,
        unlockTotal,
        unlockTotalStacks,
        vestingTotal,
        vesting_total,
      };
    }
    return null;
  } catch (e) {
    return null;
  }
}
