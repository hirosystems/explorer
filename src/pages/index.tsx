import { HomeClient } from '@/app/HomeClient';
import { Meta } from '@/components/meta-head';
import { FC } from 'react';
import { CMS_URL } from '@/common/constants';

const Home: FC = () => {
  return (
    <>
      <Meta />
      <HomeClient />
    </>
  );
};

export async function getServerSideProps() {
  try {
    const res = await fetch(CMS_URL);
    const content = await res.json();
    return { props: { content } };
  } catch (error) {
    console.error('Failed to fetch content from CMS', error);
    return { props: { content: null } };
  }
}

export default Home;
