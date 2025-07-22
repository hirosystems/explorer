'use client';

import { TxTableFiltersProvider } from '@/common/components/table/tx-table/useTxTableFilters';
import { useSearchParams } from 'next/navigation';
import * as React from 'react';
import 'react-datepicker/dist/react-datepicker.css';

import { SearchPageContent } from './SearchPageContent';

export default function SearchPage() {
  const searchParams = useSearchParams();

  const defaultFromAddress = searchParams.get('fromAddress') || '';
  const defaultToAddress = searchParams.get('toAddress') || '';
  const defaultStartTime = searchParams.get('startTime') || '';
  const defaultEndTime = searchParams.get('endTime') || '';
  const defaultTransactionType = searchParams.get('transactionType')?.split(',') || [];

  return (
    <TxTableFiltersProvider
      defaultFromAddress={defaultFromAddress}
      defaultToAddress={defaultToAddress}
      defaultStartTime={defaultStartTime}
      defaultEndTime={defaultEndTime}
      defaultTransactionType={defaultTransactionType}
    >
      <SearchPageContent />
    </TxTableFiltersProvider>
  );
}
