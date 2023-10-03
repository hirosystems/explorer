import { HomePage } from '@/appPages/HomeClient';

function Home({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  console.log('[DEBUG] rendering home');
  return <HomePage />;
}

export default Home;
