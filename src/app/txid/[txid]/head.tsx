import { DefaultHeadTags } from '../../DefaultHeadTags';
import { defaultTitle } from '../../common/consts/head';

export default function Head() {
  const title = `Transaction - ${defaultTitle}`;
  return (
    <>
      <title>{title}</title>
      <meta property="og:title" content={title} />
      <DefaultHeadTags />
    </>
  );
}
