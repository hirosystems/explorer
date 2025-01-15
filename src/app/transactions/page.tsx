import * as React from 'react';
import 'react-datepicker/dist/react-datepicker.css';

import { getTokenPrice } from '../getTokenPriceInfo';
import Page from './PageClient';

export default async function ({
  searchParams: { startTime, endTime, fromAddress, toAddress },
}: {
  searchParams: {
    startTime?: string;
    endTime?: string;
    fromAddress?: string;
    toAddress?: string;
  };
}) {
  const tokenPrice = {
    stxPrice: 123,
    btcPrice: 123,
  };
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
