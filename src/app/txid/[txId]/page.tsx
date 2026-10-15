import { ApiError } from '@/api/ApiError';
import { fetchContractInfo, fetchTx, fetchTxEvents } from '@/api/data-fetchers';
import { getTokenPrice } from '@/app/getTokenPriceInfo';
import { CommonSearchParams } from '@/app/transactions/page';
import { NetworkModes } from '@/common/types/network';
import { TxDetails, TxEventListResponse } from '@/common/types/tx-v3';
import { logError } from '@/common/utils/error-utils';
import { getApiUrl } from '@/common/utils/network-utils';
import {
  TOKENS_TRANSFERRED_MAX_EVENTS,
  TX_DETAILS_INCLUDE,
  canListTokensTransferred,
} from '@/common/utils/tx-details-utils';
import { validateStacksContractId } from '@/common/utils/utils';

import { ContractInterfaceResponse } from '@stacks/stacks-blockchain-api-types';

import TransactionIdPage from './PageClient';
import { TxIdPageDataProvider } from './TxIdPageContext';

export interface TxIdPageSearchParams extends CommonSearchParams {
  startTime?: string;
  endTime?: string;
  fromAddress?: string;
  toAddress?: string;
  transactionType?: string;
  ssr?: string;
}

export interface TxIdPageFilters {
  startTime?: string;
  endTime?: string;
  fromAddress?: string;
  toAddress?: string;
  transactionType?: string[];
}

export default async function Page(props: {
  params: Promise<{ txId: string }>;
  searchParams: Promise<TxIdPageSearchParams>;
}) {
  const params = await props.params;
  const { txId } = params;
  const searchParams = await props.searchParams;
  const { startTime, endTime, chain, api, fromAddress, toAddress, transactionType, ssr } =
    searchParams;
  const apiUrl = getApiUrl(chain || NetworkModes.Mainnet, api);

  let tokenPrice = {
    stxPrice: 0,
    btcPrice: 0,
  };
  let initialTxData: TxDetails | undefined;
  let initialTxEvents: TxEventListResponse | undefined;
  let numFunctions: number | undefined;
  let isTxNotFound = false;

  const isContractId = validateStacksContractId(txId);
  const isSSRDisabled = ssr === 'false';

  if (!isSSRDisabled) {
    try {
      tokenPrice = await getTokenPrice();
      if (isContractId) {
        const contractData = await fetchContractInfo(apiUrl, txId); // fetch contract data for tx_id
        const abi: ContractInterfaceResponse | null = contractData?.abi
          ? JSON.parse(contractData.abi)
          : null;
        numFunctions = abi?.functions?.length;
        initialTxData = await fetchTx(apiUrl, contractData.tx_id, { include: TX_DETAILS_INCLUDE });
      } else {
        initialTxData = await fetchTx(apiUrl, txId, { include: TX_DETAILS_INCLUDE });
      }
    } catch (error) {
      if (error instanceof ApiError && error.status === 404) {
        isTxNotFound = true;
      } else {
        logError(
          error as Error,
          'Transaction Id page server-side fetch for initial data',
          { txId, tokenPrice, initialTxData, chain, api },
          'error'
        );
      }
    }

    if (initialTxData && canListTokensTransferred(initialTxData)) {
      try {
        initialTxEvents = await fetchTxEvents(
          apiUrl,
          initialTxData.tx_id,
          TOKENS_TRANSFERRED_MAX_EVENTS
        );
      } catch (error) {
        // Not fatal: the Tokens Transferred row fetches the events in the browser instead.
        logError(
          error as Error,
          'Transaction Id page server-side fetch for transaction events',
          { txId, chain, api },
          'error'
        );
      }
    }
  }

  // notFound() throws, so it has to run outside the try/catch above.
  if (isTxNotFound) {
    const { notFound } = await import('next/navigation');
    notFound();
  }

  return (
    <TxIdPageDataProvider
      stxPrice={tokenPrice.stxPrice}
      initialTxData={initialTxData}
      initialTxEvents={initialTxEvents}
      txId={txId}
      numFunctions={numFunctions}
      filters={{
        fromAddress: fromAddress || '',
        toAddress: toAddress || '',
        startTime: startTime || '',
        endTime: endTime || '',
        transactionType: transactionType ? transactionType.split(',') : [],
      }}
    >
      <TransactionIdPage />
    </TxIdPageDataProvider>
  );
}
