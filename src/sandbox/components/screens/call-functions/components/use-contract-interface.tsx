import { ClarityAbi, ClarityAbiFunction } from '@stacks/transactions';
import { useRecoilValue } from 'recoil';
import {
  contractSearchQueryState,
  currentFunctionState,
  txContractState,
} from '@sandbox/store/sandbox';
import { SmartContractTransaction } from '@stacks/stacks-blockchain-api-types';
import { useAppSelector } from '@common/state/hooks';
import { selectActiveNetwork } from '@common/state/network-slice';

export const useContractInterface = (): [
  Partial<SmartContractTransaction & { abi: ClarityAbi }> | undefined,
  string,
  ClarityAbiFunction
] => {
  const apiServer = useAppSelector(selectActiveNetwork).url;
  const contractId = useRecoilValue(contractSearchQueryState);
  const functionName = useRecoilValue(currentFunctionState);
  const contractInterface = useRecoilValue(txContractState({ apiServer, contractId }));
  const func = functionName
    ? contractInterface?.abi?.functions.find((fn: ClarityAbiFunction) => fn.name === functionName)
    : undefined;

  return [contractInterface, contractId, func];
};
