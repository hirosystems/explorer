import AddressPage from './PageClient';

type AddressIdPageParams = { principal: string };

export default async function (props: { params: Promise<AddressIdPageParams> }) {
  const { params } = props;
  const { principal } = await params;
  return <AddressPage principal={principal} />;
}
