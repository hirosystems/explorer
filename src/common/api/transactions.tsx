import fetch from 'isomorphic-unfetch';

export async function fetchTx({ txid }: { txid: string }) {
  const resp = await fetch(process.env.API_SERVER + '/tx/' + txid);
  const transaction = await resp.json();
  return { transaction };
}
