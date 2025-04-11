import { TX_TABLE_PAGE_SIZE } from '@/common/components/table/table-examples/consts';
import { getApiUrl } from '@/common/utils/network-utils';
import { QueryClient, dehydrate } from '@tanstack/react-query';
import 'react-datepicker/dist/react-datepicker.css';

import { getTokenPrice } from '../getTokenPriceInfo';
import Page from './PageClient';
import { compressTransactions } from './utils';

export interface TxPageFilters {
  startTime?: string;
  endTime?: string;
  fromAddress?: string;
  toAddress?: string;
}

export interface TxPageSearchParams extends TxPageFilters {
  chain?: string;
  api?: string;
}

export default async function (props: { searchParams: Promise<TxPageSearchParams> }) {
  const searchParams = await props.searchParams;
  const { startTime, endTime, fromAddress, toAddress, chain, api } = searchParams;
  const params = new URLSearchParams({
    limit: `${TX_TABLE_PAGE_SIZE}`,
    offset: '0',
    ...(startTime && { start_time: startTime }),
    ...(endTime && { end_time: endTime }),
    ...(fromAddress && { sender_address: fromAddress }),
    ...(toAddress && { recipient_address: toAddress }),
  });
  const apiUrl = api ? api : getApiUrl(chain || 'mainnet');

  const response = await fetch(`${apiUrl}/extended/v1/tx/?${params.toString()}`, {
    next: {
      revalidate: 20, // nextjs caches the response for 20s (about 2-3 blocks)
    },
  });

  const data = await response.json();
  const compressedData = {
    ...data,
    results: compressTransactions(data.results),
  };

  const tokenPrice = await getTokenPrice();

  const queryClient = new QueryClient();

  // Prefetch the query and store it in the query cache
  await queryClient.prefetchQuery({
    queryKey: [
      'confirmedTransactions',
      TX_TABLE_PAGE_SIZE,
      0,
      ...(fromAddress ? [{ fromAddress }] : []),
      ...(toAddress ? [{ toAddress }] : []),
      ...(startTime ? [{ startTime }] : []),
      ...(endTime ? [{ endTime }] : []),
    ],
    queryFn: () => Promise.resolve(compressedData),
  });

  // Dehydrate the query cache to pass to the client
  const dehydratedState = dehydrate(queryClient);

  return (
    <Page
      tokenPrice={tokenPrice}
      filters={{
        fromAddress,
        toAddress,
        startTime,
        endTime,
      }}
      dehydratedState={dehydratedState}
    />
  );
}
