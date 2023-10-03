import { DefaultHeadTags } from '../DefaultHeadTags';

export default function Head() {
  const title = `Sandbox - Stacks Explorer by Hiro`;
  return (
    <>
      <title>{title}</title>
      <meta property="og:title" content={title} />
      <DefaultHeadTags />
    </>
  );
}
