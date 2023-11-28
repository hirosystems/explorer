'use client';

import { ContractInterfaceResponse } from '@stacks/stacks-blockchain-api-types';

import { ContractResponse } from './tx';

export type ContractWithParsedAbi = Omit<ContractResponse, 'abi'> & {
  abi?: ContractInterfaceResponse;
};
