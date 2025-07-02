import { getTokenPrice } from '@/app/getTokenPriceInfo';
<<<<<<< HEAD

import TransactionIdPage from './PageClient';
import { TxIdPageDataProvider } from './TxIdPageContext';

export default async function Page(props: { params: Promise<{ txId: string }> }) {
  const params = await props.params;
  const { txId } = params;
  const tokenPrice = await getTokenPrice();

  return (
    <TxIdPageDataProvider stxPrice={tokenPrice.stxPrice}>
      <TransactionIdPage txId={txId} />
=======
import dynamic from 'next/dynamic';

import { TxIdPageDataProvider } from './TxIdPageContext';
import Skeleton from './skeleton';

const PageClient = dynamic(() => import('./PageClient'), {
  loading: () => <Skeleton />,
});

export default async function Page(props: { params: Promise<{ txId: string }> }) {
  const params = await props.params;
  const { txId } = params;
  const tokenPrice = await getTokenPrice();

  return (
    <TxIdPageDataProvider stxPrice={tokenPrice.stxPrice}>
      <PageClient txId={txId} />
>>>>>>> d30c5ecb (feat: first draft of the token transfer id page)
    </TxIdPageDataProvider>
  );
}
