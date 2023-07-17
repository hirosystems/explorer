import { useApi } from '@/common/api/client';
import { ContractWithParsedAbi } from '@/common/types/contract';
import { UseQueryOptions, useQuery } from '@tanstack/react-query';

export const useContractById = (
  api: ReturnType<typeof useApi>,
  { contractId }: { contractId: string },
  options: UseQueryOptions<any, any, any, any> = {}
) => {
  return useQuery<ContractWithParsedAbi>(
    ['contractById', contractId],
    () =>
      api.smartContractsApi
        .getContractById({
          contractId,
        })
        .then((contract: any) => ({
          ...contract,
          abi: contract.abi ? JSON.parse(contract.abi) : undefined,
        })),
    { staleTime: Infinity, ...options }
  );
};
