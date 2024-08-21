'use client';

import {
  ClarityAbiType,
  ClarityAbiTypeTuple,
  ClarityValue,
  cvToString,
  deserializeCV,
  encodeAbiClarityValue,
  isClarityAbiOptional,
  isClarityAbiTuple,
  noneCV,
  someCV,
  tupleCV,
} from '@stacks/transactions';

import { ReadOnlyResponse } from '../../common/types/ReadOnlyResponse';
import { TupleValueType } from './types/values';

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

export const encodeTuple = (
  tuple: ClarityAbiTypeTuple['tuple'],
  value: TupleValueType
): ClarityValue => {
  const tupleData = tuple.reduce(
    (acc, tupleEntry) => {
      const _type = tupleEntry.type;
      acc[tupleEntry.name] = encodeAbiClarityValue(value[tupleEntry.name].toString(), _type);
      return acc;
    },
    {} as Record<string, ClarityValue>
  );
  return tupleCV(tupleData);
};

export const encodeOptional = (optionalType: ClarityAbiType, value: string): ClarityValue => {
  if (value) {
    try {
      return someCV(encodeAbiClarityValue(value, optionalType));
    } catch (e) {
      return noneCV();
    }
  } else {
    return noneCV();
  }
};

const allValuesNotEmpty = (value: TupleValueType) => {
  return Object.values(value).reduce((previous, value) => previous && value !== '', true);
};

export const encodeOptionalTuple = (
  optionalType: ClarityAbiTypeTuple['tuple'],
  value: TupleValueType
): ClarityValue => {
  if (allValuesNotEmpty(value)) {
    return someCV(encodeTuple(optionalType, value));
  } else {
    return noneCV();
  }
};
