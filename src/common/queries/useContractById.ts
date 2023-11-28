'use client';

import {
  UseQueryResult,
  UseSuspenseQueryResult,
  useQuery,
  useSuspenseQuery,
} from '@tanstack/react-query';

import { useApi } from '../api/useApi';
import { ContractWithParsedAbi } from '../types/contract';

export function useContractById(
  contractId?: string,
  options: any = {}
): UseQueryResult<ContractWithParsedAbi> {
  const api = useApi();
  return useQuery({
    queryKey: ['contractById', contractId],
    queryFn: async () => {
      const contract = await api.smartContractsApi.getContractById({
        contractId: contractId!,
      });
      return {
        ...contract,
        abi: contract.abi ? JSON.parse(contract.abi) : undefined,
      } as ContractWithParsedAbi;
    },
    staleTime: Infinity,
    enabled: !!contractId,
    ...options,
  });
}

export function useSuspenseContractById(
  contractId?: string,
  options: any = {}
): UseSuspenseQueryResult<ContractWithParsedAbi> {
  const api = useApi();
  if (!contractId) throw new Error('Contract ID is required');
  return useSuspenseQuery({
    queryKey: ['contractById', contractId],
    queryFn: async () => {
      const contract = await api.smartContractsApi.getContractById({
        contractId,
      });
      return {
        ...contract,
        abi: contract.abi ? JSON.parse(contract.abi) : undefined,
      } as ContractWithParsedAbi;
    },
    staleTime: Infinity,
    ...options,
  });
}
