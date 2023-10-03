import type { NextPage } from 'next';
import { PageTitle } from '@/appPages/common/components/PageTitle';
import { TokensList } from '@/appPages/tokens/TokensList/TokensList';

const TokensPage: NextPage = () => (
  <>
    <PageTitle>Token Tracker</PageTitle>
    <TokensList />
  </>
);

export default TokensPage;
