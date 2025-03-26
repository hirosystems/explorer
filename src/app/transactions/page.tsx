import 'react-datepicker/dist/react-datepicker.css';

import { getTokenPrice } from '../getTokenPriceInfo';
import Page from './PageClient';

export interface TxPageFilters {
  startTime?: string;
  endTime?: string;
  fromAddress?: string;
  toAddress?: string;
}

export default async function (props: { searchParams: Promise<TxPageFilters> }) {
  const searchParams = await props.searchParams;

  const { startTime, endTime, fromAddress, toAddress } = searchParams;

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
