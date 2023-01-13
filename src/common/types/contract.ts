import { ContractResponse } from '@/common/types/tx';

import { ContractInterfaceResponse } from '@stacks/stacks-blockchain-api-types';

export type ContractWithParsedAbi = Omit<ContractResponse, 'abi'> & {
  abi?: ContractInterfaceResponse;
};
