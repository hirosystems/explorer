import { HomeClient } from '@/app/HomeClient';
import { Meta } from '@/components/meta-head';
import { FC } from 'react';
import { REDIS_URL } from '@/common/constants';

const Home: FC = () => {
  console.log('[DEBUG] rendering home page');
  console.log('REDIS_URL', REDIS_URL);
  return (
    <>
      <Meta />

      <HomeClient />
    </>
  );
};

export default Home;
