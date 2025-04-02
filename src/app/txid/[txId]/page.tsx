import { getTokenPrice } from '@/app/getTokenPriceInfo';

import TransactionIdPage from './PageClient';
import { TxIdPageDataProvider } from './TxIdPageContext';

export default async function Page(props: { params: Promise<{ txId: string }> }) {
  const params = await props.params;
  const { txId } = params;
  const tokenPrice = await getTokenPrice();

  return (
    <TxIdPageDataProvider stxPrice={tokenPrice.stxPrice}>
      <TransactionIdPage txId={txId} />
    </TxIdPageDataProvider>
  );
}
