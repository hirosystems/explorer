import React from 'react';

import { getTokenPrice } from '../getTokenPriceInfo';
import TransactionsPage from './TransactionPage';

export default async function () {
  const tokenPrice = await getTokenPrice();
  return <TransactionsPage tokenPrice={tokenPrice} />;
}
