import { HomeClient } from '@/app/HomeClient';
import { FC } from 'react';

const Home: FC<{
  params: { slug: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}> = ({ params, searchParams }) => {
  console.log('[DEBUG] rendering home');
  return <HomeClient />;
};

export default Home;
