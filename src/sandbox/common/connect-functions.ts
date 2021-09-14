import { openSTXTransfer, openContractCall, openContractDeploy } from '@stacks/connect';
import type {
  ContractCallOptions,
  STXTransferOptions,
  ContractDeployOptions,
} from '@stacks/connect';
import { CONNECT_AUTH_ORIGIN } from '@common/constants';
import { PostConditionMode } from '@stacks/transactions';

export const handleStxTransfer = async (options: STXTransferOptions): Promise<void | null> => {
  const payload = await openSTXTransfer({
    ...options,
    authOrigin: CONNECT_AUTH_ORIGIN,
  });
  return payload;
};

export const handleContractCall = async (options: ContractCallOptions): Promise<void | null> => {
  const payload = await openContractCall({
    postConditionMode: PostConditionMode.Allow,
    ...options,
    authOrigin: CONNECT_AUTH_ORIGIN,
  });
  return payload;
};

export const handleContractDeploy = async (
  options: ContractDeployOptions
): Promise<void | null> => {
  const payload = await openContractDeploy({
    ...options,
    authOrigin: CONNECT_AUTH_ORIGIN,
  });
  return payload;
};
