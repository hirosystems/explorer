import { DefaultHeadTags } from './DefaultHeadTags';
import { defaultTitle } from './common/consts/head';

export default function Head() {
  return (
    <>
      <title>{defaultTitle}</title>
      <meta property="og:title" content={defaultTitle} />
      <DefaultHeadTags />
    </>
  );
}
