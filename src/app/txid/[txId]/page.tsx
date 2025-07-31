import { getTokenPrice } from '@/app/getTokenPriceInfo';
import { CommonSearchParams } from '@/app/transactions/page';
import { DEFAULT_MAINNET_SERVER, DEFAULT_TESTNET_SERVER } from '@/common/constants/env';
import { NetworkModes } from '@/common/types/network';
import { logError } from '@/common/utils/error-utils';
import { getApiUrl } from '@/common/utils/network-utils';

import { MempoolTransaction, Transaction } from '@stacks/stacks-blockchain-api-types';

import TransactionIdPage from './PageClient';
import { TxIdPageDataProvider } from './TxIdPageContext';
import { fetchTxById } from './page-data';

export default async function Page(props: {
  params: Promise<{ txId: string }>;
  searchParams: Promise<CommonSearchParams>;
}) {
  const params = await props.params;
  const searchParams = await props.searchParams;
  const { txId } = params;
  const chain = (searchParams.chain as NetworkModes) || NetworkModes.Mainnet;
  const api =
    searchParams.api || chain === NetworkModes.Mainnet
      ? DEFAULT_MAINNET_SERVER
      : DEFAULT_TESTNET_SERVER;
  let tokenPrice = {
    stxPrice: 0,
    btcPrice: 0,
  };
  let initialTxData: Transaction | MempoolTransaction | undefined;
  try {
    tokenPrice = await getTokenPrice();
    initialTxData = await fetchTxById(getApiUrl(chain, api), txId);
  } catch (error) {
    logError(
      error as Error,
      'Transaction Id page server-side fetch for initial data',
      { txId, tokenPrice, initialTxData, chain, api },
      'error'
    );
  }

  return (
    <TxIdPageDataProvider stxPrice={tokenPrice.stxPrice} initialTxData={initialTxData} txId={txId}>
      <TransactionIdPage />
    </TxIdPageDataProvider>
  );
}
