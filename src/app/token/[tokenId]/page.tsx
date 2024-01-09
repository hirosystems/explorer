import dynamic from 'next/dynamic';
import * as React from 'react';

import Skeleton from '../../sandbox/skeleton';
import { getTokenInfo } from './getTokenInfo';

const Page = dynamic(() => import('./PageClient'), {
  loading: () => <Skeleton />,
  ssr: false,
});

export default async function ({
  params: { tokenId },
  searchParams: { chain, api },
}: {
  params: { tokenId: string };
  searchParams: { chain: string; api: string };
}) {
  const tokenInfo = await getTokenInfo(tokenId, chain, api);
  return <Page tokenId={tokenId} tokenInfo={tokenInfo} />;
}
