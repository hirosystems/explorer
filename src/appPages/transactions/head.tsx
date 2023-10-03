import { DefaultHeadTags } from '../DefaultHeadTags';

export default function Head() {
  const title = `Recent transactions`;
  return (
    <>
      <title>{title}</title>
      <meta property="og:title" content={title} />
      <DefaultHeadTags />
    </>
  );
}
