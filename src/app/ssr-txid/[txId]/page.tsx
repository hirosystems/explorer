import * as React from 'react';
import { string } from 'yup';

import { TokenTransferPage } from '../../txid/[txId]/TokenTransfer';

export default async function Page({
  params: { txId }, // searchParams: { chain, api },
}: {
  params: { txId: string };
  // searchParams: { chain: string; api: string };
}) {
  // const data = await fetch('https://webhook.site/fb754453-8ecf-4885-b2bb-000921284770?d=123', {
  //   next: { revalidate: 20 }, // Revalidate cache every 20 seconds
  // });
  // const txId = (await params).txId;

  if (!txId) {
    return null;
  }

  const data = await fetch(
    `https://api.hiro.so/extended/v1/tx/${txId}?event_limit=100&event_offset=0`,
    {
      next: { revalidate: 20 }, // Revalidate cache every 20 seconds
    }
  );

  const tx = await data.json();
  const blockHash = 'block_hash' in tx && tx.block_hash !== '0x' ? tx.block_hash : undefined;

  const block = blockHash
    ? await (await fetch(`https://api.hiro.so/extended/v1/block/${blockHash}`)).json()
    : undefined;

  return <TokenTransferPage tx={tx} txBlock={block} />;

  // return (
  //   <>
  //     {txId}
  //     <p>{JSON.stringify(tx, null, 4)}</p>
  //   </>
  // );
}
