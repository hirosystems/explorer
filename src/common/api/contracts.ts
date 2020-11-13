import { fetchFromSidecar } from '@common/api/fetch';

import type { ContractInterfaceResponse } from '@blockstack/stacks-blockchain-api-types';
import type { Contract, ContractResponse } from '@models/contract.interface';

export const fetchContract = (apiServer: string) => async (
  contract_id: string
): Promise<Contract | { error: string }> => {
  const resp = await fetchFromSidecar(apiServer)(`/contract/${contract_id}`);
  const data: ContractResponse = await resp.json();
  if ('abi' in data) {
    return {
      ...data,
      abi: JSON.parse(data.abi) as ContractInterfaceResponse,
    };
  }
  return data;
};
