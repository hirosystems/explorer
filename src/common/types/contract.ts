import { ContractInterfaceResponse } from '@stacks/stacks-blockchain-api-types';
import { ContractResponse } from '@/common/types/tx';

export type ContractWithParsedAbi = Omit<ContractResponse, 'abi'> & {
  abi?: ContractInterfaceResponse;
};
