import { ClarityAbi, ClarityAbiFunction } from '@stacks/transactions';
import { useApiServer } from '@common/hooks/use-api';
import { useRecoilValue } from 'recoil';
import {
  contractSearchQueryState,
  currentFunctionState,
  txContractState,
} from '@sandbox/store/sandbox';
import { SmartContractTransaction } from '@blockstack/stacks-blockchain-api-types';

export const useContractInterface = (): [
  Partial<SmartContractTransaction & { abi: ClarityAbi }> | undefined,
  string,
  ClarityAbiFunction
] => {
  const apiServer = useApiServer();
  const contractId = useRecoilValue(contractSearchQueryState);
  const functionName = useRecoilValue(currentFunctionState);
  const contractInterface = useRecoilValue(txContractState({ apiServer, contractId }));
  const func = functionName
    ? contractInterface?.abi?.functions.find((fn: ClarityAbiFunction) => fn.name === functionName)
    : undefined;

  return [contractInterface, contractId, func];
};
