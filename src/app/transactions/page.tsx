import 'react-datepicker/dist/react-datepicker.css';

import { getTokenPrice } from '../getTokenPriceInfo';
import Page from './PageClient';

export interface TxPageFilters {
  startTime?: string;
  endTime?: string;
  fromAddress?: string;
  toAddress?: string;
}

export default async function ({
  searchParams: { startTime, endTime, fromAddress, toAddress },
}: {
  searchParams: TxPageFilters;
}) {
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
    />
  );
}
