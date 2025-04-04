import BlockPage from './PageClient';

type BlockPageParams = { hash: string };

export default async function (props: { params: Promise<BlockPageParams> }) {
  const { params } = props;
  const { hash } = await params;
  return <BlockPage hash={hash} />;
}
