import { getTokenPrice } from '@/app/getTokenPriceInfo';
import { logError } from '@/common/utils/error-utils';

import TransactionIdPage from './PageClientNoSSR';
import { TxIdPageDataProvider } from './TxIdPageContext';

export default async function Page(props: { params: Promise<{ txId: string }> }) {
  const params = await props.params;
  const { txId } = params;
  let tokenPrice = {
    stxPrice: 0,
    btcPrice: 0,
  };
  try {
    tokenPrice = await getTokenPrice();
  } catch (error) {
    logError(
      error as Error,
      'Transaction Id page server-side fetch for token price',
      { txId, tokenPrice },
      'error'
    );
  }

  return (
    <TxIdPageDataProvider stxPrice={tokenPrice.stxPrice}>
      <TransactionIdPage txId={txId} />
    </TxIdPageDataProvider>
  );
}
