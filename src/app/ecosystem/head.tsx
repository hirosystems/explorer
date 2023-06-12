import { DefaultHeadTags } from '../DefaultHeadTags';

export default function Head() {
  const title = `Ecosystem`;
  return (
    <>
      <title>{title}</title>
      <meta property="og:title" content={title} />
      <DefaultHeadTags />
    </>
  );
}
