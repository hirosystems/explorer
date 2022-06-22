import { fetchFromSidecar } from './fetch';

export const fetchNonce = (apiServer: string) => async (principal: string) => {
  const res = await fetchFromSidecar(apiServer)(`/address/${principal}/nonces`);
  return res.json();
};
