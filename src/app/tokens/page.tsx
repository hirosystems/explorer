'use client';

import { PageTitle } from '@/app/common/components/PageTitle';
import type { NextPage } from 'next';
import { TokensList } from '@/app/tokens/TokensList';

const TokensPage: NextPage = () => (
  <>
    <PageTitle>Token Tracker</PageTitle>
    <TokensList />
  </>
);

export default TokensPage;
