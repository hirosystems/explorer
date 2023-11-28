import { TokenPage } from './TokenPage';
import { getTokenInfo } from './getTokenInfo';

export default async function Page({
  params: { tokenId },
  searchParams: { chain, api },
}: {
  params: { tokenId: string };
  searchParams: { chain: string; api: string };
}) {
  const tokenInfo = await getTokenInfo(tokenId, chain, api);
  return <TokenPage tokenId={tokenId} tokenInfo={tokenInfo} />;
}
