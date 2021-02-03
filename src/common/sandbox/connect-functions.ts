import { openSTXTransfer, openContractCall, openContractDeploy } from '@stacks/connect';
import type {
  ContractCallOptions,
  STXTransferOptions,
  ContractDeployOptions,
} from '@stacks/connect';
import { CONNECT_AUTH_ORIGIN } from '@common/constants';

export const handleStxTransfer = async (options: STXTransferOptions): Promise<void> => {
  return openSTXTransfer({
    ...options,
    authOrigin: CONNECT_AUTH_ORIGIN,
  });
};

export const handleContractCall = async (options: ContractCallOptions): Promise<void> => {
  return openContractCall({
    ...options,
    authOrigin: CONNECT_AUTH_ORIGIN,
  });
};

export const handleContractDeploy = async (options: ContractDeployOptions): Promise<void> => {
  return openContractDeploy({
    ...options,
    authOrigin: CONNECT_AUTH_ORIGIN,
  });
};
