import { microToStacksFormatted } from '@/common/utils/utils';

import {
  ContractCallTransaction,
  MempoolContractCallTransaction,
} from '@stacks/stacks-blockchain-api-types';
import { cvToJSON, hexToCV } from '@stacks/transactions';

import { FunctionArg } from './FunctionArgsTable';
import { FunctionResult } from './FunctionResultsTable';

const formatClarityValueType = (type: string) => {
  // TODO: add tests for this
  if (type === 'bool' || type === 'int' || type === 'principal' || type === 'uint') {
    switch (type) {
      case 'bool':
        return 'Boolean';
      case 'int':
        return 'Integer';
      case 'principal':
        return 'Principal';
      case 'uint':
        return 'Unsigned Integer';
    }
  }

  if (type.includes('tuple')) {
    return 'Tuple';
  }
  return type;
};

const tupleToArr = (
  tuple: string // TODO: add tests for this
) =>
  tuple
    .replace('(tuple (', '')
    .replace('))', '')
    .split(') (')
    .map(item => item.split(' '));

function formatTupleResult(tuple: string) {
  // TODO: add tests for this
  const tupleArr = tupleToArr(tuple);
  let result = '';
  tupleArr.forEach((entry: any, index: number) => {
    if (entry && entry.length) {
      const key = entry?.[0]?.replace(/\(/g, '');
      const value = entry?.[1]?.replace(/\)/g, '');
      result += `${key}: ${value}`;

      if (index !== tuple.length - 1) {
        result += ', ';
      }
    }
  });

  return result;
}

export function formatFunctionArgs( // TODO: add tests for this
  tx: ContractCallTransaction | MempoolContractCallTransaction
): FunctionArg[] {
  const args = (tx?.contract_call?.function_args || []).filter(arg => !!arg);
  return args.map(arg => {
    let value: string = arg.repr;
    if (arg.type === 'principal') {
      const principal = arg.hex ? (cvToJSON(hexToCV(arg.hex)) || {}).value : '';
      const isContract = principal.includes('.');
      value = isContract ? principal : arg.repr;
    }
    if (arg.type === 'uint') {
      value = arg.repr.replace('u', '');
      if (arg.name.includes('ustx')) {
        value = `${microToStacksFormatted(value)} STX`;
      }
      value = parseInt(value).toLocaleString();
    }
    if (arg.type.includes('tuple')) {
      value = formatTupleResult(arg.repr);
    }

    return {
      name: arg.name,
      value,
      type: formatClarityValueType(arg.type),
    };
  });
}

export function formatFunctionResult(
  tx: ContractCallTransaction | MempoolContractCallTransaction
): FunctionResult[] {
  const result = tx?.tx_result;
  if (!result) return [];
  const { success, type, value } = cvToJSON(hexToCV(result.hex));
  const hasType = !type?.includes('UnknownType');
}
