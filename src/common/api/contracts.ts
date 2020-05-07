import { Contract } from '@models/contract.interface';
import { fetchFromSidecar } from '@common/api/fetch';

export async function fetchContract(contract_id: string): Promise<Contract> {
  const resp = await fetchFromSidecar(`/contract/${contract_id}`);
  return resp.json();
}
