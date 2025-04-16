import { TX_TABLE_PAGE_SIZE } from '@/common/components/table/table-examples/consts';
import { GenericResponseType } from '@/common/hooks/useInfiniteQueryResult';
import { fetchBnsAddress } from '@/common/queries/bns-queries';
import { NetworkModes } from '@/common/types/network';
import { logError } from '@/common/utils/error-utils';
import { getApiUrl } from '@/common/utils/network-utils';
import 'react-datepicker/dist/react-datepicker.css';

import { getTokenPrice } from '../getTokenPriceInfo';
import Page from './PageClient';
import { CompressedTxTableData, compressTransactions } from './utils';

export interface TxPageFilters {
  startTime?: string;
  endTime?: string;
  fromAddress?: string;
  toAddress?: string;
}

export interface CommonSearchParams {
  chain?: string;
  api?: string;
}

export interface RedesignSearchParams {
  redesign?: string;
}

export interface TxPageSearchParams
  extends TxPageFilters,
    CommonSearchParams,
    RedesignSearchParams {}

export default async function (props: { searchParams: Promise<TxPageSearchParams> }) {
  const searchParams = await props.searchParams;
  const { startTime, endTime, chain, api, fromAddress, toAddress, redesign } = searchParams;

  const apiUrl = getApiUrl(chain || NetworkModes.Mainnet, api);

  let initialTxTableData: GenericResponseType<CompressedTxTableData> | undefined;

  if (redesign === 'true') {
    try {
      let bnsAddress;
      if (apiUrl && fromAddress?.endsWith('.btc')) {
        bnsAddress = await fetchBnsAddress(apiUrl, fromAddress);
      }
      if (apiUrl && toAddress?.endsWith('.btc')) {
        bnsAddress = await fetchBnsAddress(apiUrl, toAddress);
      }

      const params = new URLSearchParams({
        limit: `${TX_TABLE_PAGE_SIZE}`,
        offset: '0',
        ...(startTime && { start_time: startTime }),
        ...(endTime && { end_time: endTime }),
        ...(fromAddress && { from_address: bnsAddress || fromAddress }),
        ...(toAddress && { to_address: bnsAddress || toAddress }),
      });
      const fetchUrl = `${apiUrl}/extended/v1/tx/?${params.toString()}`;
      const response = await fetch(fetchUrl, {
        next: {
          revalidate: 20, // nextjs caches the response for 20s (about 2-3 blocks)
        },
      });

      const data = await response.json();
      const compressedData = {
        ...data,
        results: compressTransactions(data.results),
      };

      initialTxTableData = compressedData;
    } catch (error) {
      logError(
        error as Error,
        'Transaction page server-side fetch for initialTxTableData',
        {
          fromAddress,
          toAddress,
          startTime,
          endTime,
          api,
          chain,
          redesign,
          apiUrl,
          initialTxTableData,
        },
        'error'
      );
    }
  }

  const tokenPrice = await getTokenPrice();

  return (
    <Page
      tokenPrice={tokenPrice}
      filters={{
        fromAddress,
        toAddress,
        startTime,
        endTime,
      }}
      initialTxTableData={initialTxTableData}
    />
  );
}
