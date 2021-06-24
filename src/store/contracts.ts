import { atomFamilyWithQuery } from '@store/query';
import { Getter } from 'jotai';
import { apiClientsState } from '@store/api-clients';
import { ContractInterfaceResponse, ContractSourceResponse } from '@stacks/blockchain-api-client';
import { QueryRefreshRates } from '@common/constants';

// ----------------
// keys
// ----------------
export enum ContractsQueryKeys {
  INFO = 'contracts/INFO',
  SOURCE = 'contracts/SOURCE',
  INTERFACE = 'contracts/INTERFACE',
}

export function makeContractsInfoQueryKey(txId: string) {
  return [ContractsQueryKeys.INFO, txId];
}

export function makeContractsSourceQueryKey(txId: string) {
  return [ContractsQueryKeys.SOURCE, txId];
}

export function makeContractsInterfaceQueryKey(txId: string) {
  return [ContractsQueryKeys.INTERFACE, txId];
}

// ----------------
// queryFn's
// ----------------
const contractSourceQueryFn = async (get: Getter, contractPrincipal: string) => {
  const { smartContractsApi } = get(apiClientsState);
  const [contractAddress, contractName] = contractPrincipal.split('.');
  return await smartContractsApi.getContractSource({
    contractAddress,
    contractName,
  });
};

const contractInfoQueryFn = async (get: Getter, contractPrincipal: string) => {
  const { smartContractsApi } = get(apiClientsState);
  return smartContractsApi.getContractById({
    contractId: contractPrincipal,
  });
};

const contractInterfaceQueryFn = async (get: Getter, contractPrincipal: string) => {
  const { smartContractsApi } = get(apiClientsState);
  const [contractAddress, contractName] = contractPrincipal.split('.');
  return await smartContractsApi.getContractInterface({
    contractAddress,
    contractName,
  });
};

// ----------------
// atoms
// ----------------
export const contractInfoState = atomFamilyWithQuery<string, any>(
  ContractsQueryKeys.INFO,
  contractInfoQueryFn,
  { refetchInterval: QueryRefreshRates.None }
);

export const contractSourceState = atomFamilyWithQuery<string, ContractSourceResponse>(
  ContractsQueryKeys.SOURCE,
  contractSourceQueryFn,
  { refetchInterval: QueryRefreshRates.None }
);

export const contractInterfaceState = atomFamilyWithQuery<string, ContractInterfaceResponse>(
  ContractsQueryKeys.INTERFACE,
  contractInterfaceQueryFn,
  { refetchInterval: QueryRefreshRates.None }
);
