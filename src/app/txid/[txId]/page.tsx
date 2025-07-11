import { getTokenPrice } from '@/app/getTokenPriceInfo';

import TransactionIdPage from './PageClient';
import { TxIdPageDataProvider } from './TxIdPageContext';

export default async function Page(props: { params: Promise<{ txId: string }> }) {
  const params = await props.params;
  const { txId } = params;
  console.log('Tx Id Page Server component', txId);
  let tokenPrice = {
    stxPrice: 0,
    btcPrice: 0,
  };
  try {
    tokenPrice = await getTokenPrice();
  } catch (error) {
    console.error('Error fetching token price', error);
    tokenPrice = {
      stxPrice: 0,
      btcPrice: 0,
    };
  }

  return (
    <TxIdPageDataProvider stxPrice={tokenPrice.stxPrice}>
      <TransactionIdPage txId={txId} />
    </TxIdPageDataProvider>
  );
}
