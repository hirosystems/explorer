import { HomeClient } from '@/app/HomeClient';
import { ExplorerSSRPage } from '@/app/common/components/ExplorerSSRPage';
import { FC } from 'react';

const Home: FC<{
  params: { slug: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}> = ({ params, searchParams }) => {
  console.log('[DEBUG] rendering home');
  return (
    <ExplorerSSRPage params={params} searchParams={searchParams}>
      <HomeClient />
    </ExplorerSSRPage>
  );
};

export default Home;
