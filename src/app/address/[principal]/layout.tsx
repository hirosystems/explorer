import { Metadata, ResolvingMetadata } from 'next';
import { ReactNode } from 'react';

import { meta } from '../../../common/constants/meta';
import { truncateMiddle } from '../../../common/utils/utils';

export async function generateMetadata(
  { params }: any,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const title = `STX Address - ${truncateMiddle(params?.principal)}`;
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
