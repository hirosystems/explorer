import { Metadata, ResolvingMetadata } from 'next';
import React from 'react';

import { meta } from '../../common/constants/meta';

export async function generateMetadata(
  { params }: any,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const title = `Sandbox - Stacks Explorer by Hiro`;
  return Promise.resolve({
    ...meta,
    title,
    openGraph: {
      ...meta.openGraph,
      title,
    },
  });
}

function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

export default Layout;
