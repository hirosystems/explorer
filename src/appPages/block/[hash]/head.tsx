import { truncateMiddle } from '@/common/utils';

import { DefaultHeadTags } from '../../DefaultHeadTags';

export default function Head({ params: { hash } }: { params: { hash: string } }) {
  const title = `Block ${truncateMiddle(hash)}`;
  return (
    <>
      <title>{title}</title>
      <meta property="og:title" content={title} />
      <DefaultHeadTags />
    </>
  );
}
