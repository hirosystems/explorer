import dynamic from 'next/dynamic';

import Skeleton from './skeleton';

const Page = dynamic(() => import('./PageClient'), {
  loading: () => <Skeleton />,
  ssr: false,
});

export default async function () {
  return <Page />;
}
