import { RecentBlocks } from '../_components/RecentBlocks/RecentBlocks';
import { HomePageDataProvider } from './context';
import { fetchRecentBlocks } from './data';

export default async function HomeRedesign(props: {
  searchParams: Promise<Record<string, string>>;
}) {
  const searchParams = await props.searchParams;
  const chain = searchParams?.chain || 'mainnet';
  const recentBlocks = await fetchRecentBlocks(chain);
  return (
    <HomePageDataProvider recentBlocks={recentBlocks}>
      <RecentBlocks />
    </HomePageDataProvider>
  );
}
