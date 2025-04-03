import { TX_TABLE_PAGE_SIZE } from '@/common/components/table/table-examples/consts';
import { getApiUrl } from '@/common/utils/network-utils';
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
  const startTimeRequest = new Date();
  const response = await fetch(`${apiUrl}/extended/v1/tx/?${params.toString()}`, {
    next: {
      revalidate: 10,
    },
  });
  const endTimeRequest = new Date();
  console.log(
    'Time taken to fetch transactions:',
    endTimeRequest.getTime() - startTimeRequest.getTime(),
    'ms'
  );
  const data = await response.json();
  const compressedData = {
    ...data,
    results: compressTransactions(data.results),
  };

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
      initialTxTableData={compressedData}
    />
  );
}
