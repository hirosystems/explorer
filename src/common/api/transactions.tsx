import fetch from 'isomorphic-unfetch';

export async function fetchTx({ txid }: { txid: string }) {
  const resp = await fetch(process.env.apiServer + '/tx/' + txid);
  const transaction = await resp.json();
  console.log({ txid });
  return { transaction };
}
