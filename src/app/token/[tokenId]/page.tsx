import dynamic from 'next/dynamic';
import { string } from 'yup';

import Skeleton from '../../sandbox/skeleton';
import { getTokenInfo } from './getTokenInfo';
import { DeveloperData, TokenLinks } from './types';

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
  // const tokenInfo = await getTokenInfo(tokenId, chain, api);
  return (
    <Page
      tokenId={tokenId}
      tokenInfo={{
        basic: {
          name: 'abc',
          symbol: 'abc',
          totalSupply: 123,
          circulatingSupply: 123,
          imageUri: '123',
        },
        extended: {
          categories: ['abc'],

          links: {
            websites: ['abc'],
            blockchain: ['abc'],
            chat: ['abc'],
            forums: ['abc'],
            announcements: ['abc'],
            repos: ['abc'],
            social: ['abc'],
          },
          circulatingSupply: 123,

          currentPrice: 123,
          currentPriceInBtc: 123,
          priceInBtcChangePercentage24h: 123,
          priceChangePercentage24h: 123,

          marketCap: 123,

          tradingVolume24h: 132,
          tradingVolumeChangePercentage24h: 123,

          developerData: {
            forks: 123,
            stars: 123,
            subscribers: 123,
            total_issues: 123,
            closed_issues: 123,
            pull_requests_merged: 123,
            pull_request_contributors: 123,
            code_additions_deletions_4_weeks: {
              additions: 123,
              deletions: 123,
            },
            commit_count_4_weeks: 123,
            last_4_weeks_commit_activity_series: [],
          },
          marketCapRank: 123,
        },
      }}
    />
  );
}
