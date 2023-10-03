import { useRouter } from 'next/router';
import { TokenInfoProps } from '@/pages/token/[tokenId]';

import TokenPage from './page';

export function Token(props: TokenInfoProps) {
  const { query } = useRouter();
  const tokenId = query.tokenId as string;
  return <TokenPage tokenId={tokenId} tokenInfo={props} />;
}
