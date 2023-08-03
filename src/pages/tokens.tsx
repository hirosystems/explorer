import { Meta } from '@/components/meta-head';

import dynamic from 'next/dynamic';
import { PageTitle } from '@/app/common/components/PageTitle';
import { Loading as TokenListLoading } from '@/app/tokens/TokensList/loading';

const AppTokensPage = dynamic(() => import('../app/tokens/page'), {
  loading: () => (
    <>
      <PageTitle>Token Tracker</PageTitle>
      <TokenListLoading />
    </>
  ),
  ssr: false,
});

export default function TokensPage() {
  return (
    <>
      <Meta title="Token Tracker" />
      <AppTokensPage />
    </>
  );
}
