import { Metadata, ResolvingMetadata } from 'next';
import { ReactNode } from 'react';

import { meta } from '../../../common/constants/meta';
import { truncateMiddleDeprecated } from '../../../common/utils/utils';

export async function generateMetadata(props: any, parent: ResolvingMetadata): Promise<Metadata> {
  const params = await props.params;
  const title = `Token - ${truncateMiddleDeprecated(params?.tokenId)}`;
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
