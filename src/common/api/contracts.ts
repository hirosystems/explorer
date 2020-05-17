import { Contract } from '@models/contract.interface';
import { fetchFromSidecar } from '@common/api/fetch';

export const fetchContract = (apiServer: string) => async (
  contract_id: string
): Promise<Contract> => {
  const resp = await fetchFromSidecar(apiServer)(`/contract/${contract_id}`);
  return resp.json();
};
