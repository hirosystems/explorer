import { Metadata } from 'next';
import { ReactNode } from 'react';

import { meta } from '../../common/constants/meta';

export async function generateMetadata(): Promise<Metadata> {
  const title = `Recent blocks`;
  return Promise.resolve({
    ...meta,
    title,
    openGraph: {
      ...meta.openGraph,
      title,
    },
  });
}

export default function Layout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
