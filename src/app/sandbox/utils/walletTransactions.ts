'use client';

import { request } from '@stacks/connect';
import { Cl } from '@stacks/transactions';

const handleUserRejection = (error: any, operation: string) => {
  if (error?.message?.includes('User rejected') || error?.message?.includes('rejected')) {
    console.log(`User rejected ${operation} request`);
    return null;
  }
  console.error(`${operation} failed:`, error);
  throw error;
};

export const transferStx = async (params: {
  recipient: string;
  amount: string;
  memo?: string;
  network?: string;
}) => {
  try {
    const response = await request('stx_transferStx', {
      recipient: params.recipient,
      amount: params.amount,
      memo: params.memo || '',
      network: params.network || 'mainnet',
    });

    return response;
  } catch (error: any) {
    return handleUserRejection(error, 'STX transfer');
  }
};

export const deployContract = async (params: {
  name: string;
  clarityCode: string;
  clarityVersion?: number;
  network?: string;
}) => {
  try {
    const response = await request('stx_deployContract', {
      name: params.name,
      clarityCode: params.clarityCode,
      clarityVersion: params.clarityVersion || 2,
      network: params.network || 'mainnet',
      postConditionMode: 'allow',
    });

    return response;
  } catch (error: any) {
    return handleUserRejection(error, 'contract deployment');
  }
};

export const callContract = async (params: {
  contract: string;
  functionName: string;
  functionArgs: any[];
  network?: string;
  postConditions?: any[];
  postConditionMode?: 'allow' | 'deny';
}) => {
  try {
    const clarityArgs = params.functionArgs.map(arg => {
      if (typeof arg === 'number') {
        return Cl.uint(arg);
      }
      if (typeof arg === 'string') {
        return Cl.stringAscii(arg);
      }
      if (typeof arg === 'boolean') {
        return Cl.bool(arg);
      }
      return arg;
    });

    const response = await request('stx_callContract', {
      contract: params.contract as `${string}.${string}`,
      functionName: params.functionName,
      functionArgs: clarityArgs,
      network: params.network || 'mainnet',
      postConditions: params.postConditions,
      postConditionMode: params.postConditionMode,
    });

    return response;
  } catch (error: any) {
    return handleUserRejection(error, 'contract call');
  }
};

export const signMessage = async (params: { message: string }) => {
  try {
    const response = await request('stx_signMessage', {
      message: params.message,
    });

    return response;
  } catch (error: any) {
    return handleUserRejection(error, 'message signing');
  }
};

export const getAddresses = async () => {
  try {
    const response = await request('getAddresses');
    return response.addresses;
  } catch (error: any) {
    return handleUserRejection(error, 'get addresses');
  }
};

export const parseClarityValue = (clarityValue: any) => {
  if (typeof clarityValue === 'object' && clarityValue !== null) {
    return {
      type: clarityValue.type,
      value: clarityValue.value,
    };
  }
  return clarityValue;
};
