export interface TokenLinks {
  websites: string[];
  blockchain: string[];
  chat: string[];
  forums: string[];
  announcements: string[];
  repos: string[];
  social: string[];
}

export interface DeveloperData {
  forks: number | null;
  stars: number | null;
  subscribers: number | null;
  total_issues: number | null;
  closed_issues: number | null;
  pull_requests_merged: number | null;
  pull_request_contributors: number | null;
  code_additions_deletions_4_weeks: {
    additions: number | null;
    deletions: number | null;
  } | null;
  commit_count_4_weeks: number | null;
  last_4_weeks_commit_activity_series: [] | null;
}

export interface BasicTokenInfo {
  name: string;
  symbol: string;
  totalSupply: number | null;
}

export interface TokenInfoProps {
  basic?: BasicTokenInfo;
  extended?: {
    categories: string[];

    links: TokenLinks;
    circulatingSupply: number | null;
    fullyDilutedValuation: number | null;
    tvl: number | null;

    currentPrice: number | null;
    priceChangePercentage24h: number | null;
    currentPriceInBtc: number | null;
    priceInBtcChangePercentage24h: number | null;

    marketCap: number | null;

    tradingVolume24h: number | null;
    tradingVolumeChangePercentage24h: number | null;

    developerData: DeveloperData;
  };
}
