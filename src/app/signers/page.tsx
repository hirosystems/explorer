import dynamic from 'next/dynamic';

import { SignersPageSkeleton } from './skeleton';

const Page = dynamic(() => import('./PageClient'), {
  loading: () => <SignersPageSkeleton />,
});

export default function () {
  return <Page />;
}
