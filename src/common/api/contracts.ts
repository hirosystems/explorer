import { Contract, ContractResponse } from '@models/contract.interface';
import { fetchFromSidecar } from '@common/api/fetch';
import { ContractInterfaceResponse } from '@blockstack/stacks-blockchain-api-types';

export const fetchContract = (apiServer: string) => async (
  contract_id: string
): Promise<Contract | { error: string }> => {
  const resp = await fetchFromSidecar(apiServer)(`/contract/${contract_id}`);
  const data: ContractResponse = await resp.json();
  if ('abi' in data) {
    const contract = {
      ...data,
      abi: JSON.parse(data.abi) as ContractInterfaceResponse,
    };
    return contract;
  }
  return data;
};
