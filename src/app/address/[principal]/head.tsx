import { ReactNode } from 'react';

import { DefaultHeadTags } from '../../DefaultHeadTags';
import { defaultTitle } from '../../common/consts/head';

export default function Head(): ReactNode {
  const title = `STX Address - ${defaultTitle}`;
  return (
    <>
      <title>{title}</title>
      <meta property="og:title" content={title} />
      <DefaultHeadTags />
    </>
  );
}
