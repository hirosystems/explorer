import { Contract } from '@models/contract.interface';
import { fetchFromApi } from '@common/api/fetch';

export async function fetchContract(contract_id: string): Promise<Contract> {
  const resp = await fetchFromApi(`/sidecar/vi/contract/${contract_id}`);
  return resp.json();
}
