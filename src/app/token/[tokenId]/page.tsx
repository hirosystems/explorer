import dynamic from 'next/dynamic';

import Skeleton from '../../sandbox/skeleton';
import { getTokenInfo } from './getTokenInfo';

const Page = dynamic(() => import('./PageClient'), {
  loading: () => <Skeleton />,
});

export default async function (props: {
  params: Promise<{ tokenId: string }>;
  searchParams: Promise<{ chain: string; api: string }>;
}) {
  console.log('server', { apiKey: process.env.LUNAR_CRUSH_API_KEY });
  const searchParams = await props.searchParams;

  const { chain, api } = searchParams;

  const params = await props.params;

  const { tokenId } = params;

  const tokenInfo = await getTokenInfo(tokenId, chain, api);

  console.log('server', { tokenInfo });

  return <Page tokenId={tokenId} tokenInfo={tokenInfo} />;
}
