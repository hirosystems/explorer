import { HIRO_HEADERS } from '@/common/constants';

import { StacksNetwork } from '@stacks/network';
import {
  ClarityAbiType,
  ClarityAbiTypeTuple,
  ClarityValue,
  cvToString,
  deserializeCV,
  encodeClarityValue,
  isClarityAbiOptional,
  isClarityAbiTuple,
  noneCV,
  serializeCV,
  someCV,
  tupleCV,
} from '@stacks/transactions';

import { NonTupleValueType, TupleValueType } from './types/values';

export interface ClarityFunctionArg {
  name: string;
  type: ClarityAbiType;
}

interface ReadOnlyResponse {
  okay: boolean;
  result: string;
}

interface ReadOnlyOptions {
  senderAddress: string;
  contractName: string;
  contractAddress: string;
  functionName: string;
  functionArgs: ClarityValue[];
  network: StacksNetwork;
}

const cvToHex = (cv: ClarityValue) => {
  const serialized = serializeCV(cv);
  return `0x${serialized.toString('hex')}`;
};

export const callReadOnlyFunction = async ({
  senderAddress,
  contractName,
  contractAddress,
  functionName,
  functionArgs,
  network,
}: ReadOnlyOptions): Promise<ReadOnlyResponse> => {
  const url = `${
    network.coreApiUrl
  }/v2/contracts/call-read/${contractAddress}/${contractName}/${encodeURIComponent(functionName)}`;

  const args = functionArgs.map(arg => cvToHex(arg));

  const body = JSON.stringify({
    sender: senderAddress,
    arguments: args,
  });

  const response = await fetch(url, {
    method: 'POST',
    body,
    headers: {
      'Content-Type': 'application/json',
      ...HIRO_HEADERS,
    },
  });

  return response.json();
};

export const parseReadOnlyResponse = ({ result }: ReadOnlyResponse) => {
  const hex = result.slice(2);
  const bufferCv = Buffer.from(hex, 'hex');
  const clarityValue = deserializeCV(bufferCv);
  return cvToString(clarityValue);
};

export const getTuple = (type?: ClarityAbiType): ClarityAbiTypeTuple['tuple'] | undefined => {
  if (!type) return;
  const isTuple = isClarityAbiTuple(type);
  if (isTuple) return type?.tuple;
  const isOptional = isClarityAbiOptional(type);
  if (isOptional && isClarityAbiTuple(type?.optional)) return type?.optional?.tuple;
};

export const encodeTuple = (tuple: ClarityAbiTypeTuple['tuple'], value: TupleValueType) => {
  const tupleData = tuple.reduce((acc, tupleEntry) => {
    const _type = tupleEntry.type;
    acc[tupleEntry.name] = encodeClarityValue(_type, value[tupleEntry.name].toString());
    return acc;
  }, {} as Record<string, ClarityValue>);
  return tupleCV(tupleData);
};

export const encodeOptional = (optionalType: ClarityAbiType, value: NonTupleValueType) => {
  if (value) {
    return someCV(encodeClarityValue(optionalType, value.toString()));
  } else {
    return noneCV();
  }
};
