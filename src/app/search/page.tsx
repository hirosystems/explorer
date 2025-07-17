'use client';

import { TxTableFilters } from '@/common/components/table/filters/TxTableFilters';
import { TxTableFiltersModal } from '@/common/components/table/filters/TxTableFiltersModal';
import {
  TxTableFiltersProvider,
  useTxTableFilters,
} from '@/common/components/table/tx-table/useTxTableFilters';
import { Text } from '@/ui/Text';
import { Flex, Stack } from '@chakra-ui/react';
import { useSearchParams } from 'next/navigation';
import * as React from 'react';
import { useState } from 'react';
import 'react-datepicker/dist/react-datepicker.css';

import { filterToFormattedValueMap, getKeywordByFilter } from '../../common/queries/useSearchQuery';
import { TxSearchResult } from './TxSearchResult';

function SearchHeader({ resultCount }: { resultCount: number | null }) {
  return (
    <Flex
      justifyContent={'space-between'}
      alignItems={{ base: 'flex-start', md: 'baseline' }}
      flexDirection={{ base: 'column', md: 'row' }}
      gap={4}
    >
      <Text textStyle="heading-md" color="textPrimary">
        {resultCount !== null
          ? `${resultCount} result${resultCount === 1 ? '' : 's'} found`
          : 'Search results'}
      </Text>
    </Flex>
  );
}

function SearchFiltersDisplay({
  filters,
}: {
  filters: {
    fromAddress: string;
    toAddress: string;
    startTime: string;
    endTime: string;
    transactionType: string[];
  };
}) {
  const hasActiveFilters = Object.entries(filters).some(([key, value]) => {
    if (Array.isArray(value)) {
      return value.length > 0;
    }
    return value !== '';
  });
  if (!hasActiveFilters) return null;

  return (
    <Flex
      rowGap={2}
      columnGap={2.5}
      flexWrap={'wrap'}
      alignItems={'center'}
      borderBottom={'1px solid'}
      borderColor={'borderPrimary'}
      pb={4}
    >
      <Text textStyle={'text-regular-sm'} color={'textSecondary'}>
        Search results for:
      </Text>
      {Object.entries(filters).map(([key, value]) => {
        if (!value || (Array.isArray(value) && value.length === 0)) return null;
        const keyword = getKeywordByFilter(key);
        const displayValue = Array.isArray(value) ? value.join(', ') : value;
        return (
          <Text key={key} textStyle={'text-regular-sm'} color={'textPrimary'}>
            {!!keyword && (
              <Text
                textStyle={'text-medium-sm'}
                fontWeight={'medium'}
                display="inline-block"
                bg={{ base: 'feedback.blue-200', _dark: 'feedback.blue-900' }}
                color={{ base: 'feedback.blue-600', _dark: 'feedback.blue-300' }}
                borderRadius="redesign.xs"
                py={1}
                whiteSpace="pre"
                textTransform={'uppercase'}
              >
                {' '}
                {keyword}{' '}
              </Text>
            )}{' '}
            {displayValue && filterToFormattedValueMap[key]
              ? filterToFormattedValueMap[key](displayValue)
              : displayValue || ''}
          </Text>
        );
      })}
    </Flex>
  );
}

function SearchContent({ onTotalChange }: { onTotalChange: (total: number) => void }) {
  return (
    <Stack gap={5} mt={5}>
      <TxTableFilters />
      <TxSearchResult onTotalChange={onTotalChange} />
      <TxTableFiltersModal />
    </Stack>
  );
}

function SearchPageContent() {
  const { fromAddress, toAddress, startTime, endTime, transactionType } = useTxTableFilters();
  const [resultCount, setResultCount] = useState<number | null>(null);

  const filters = {
    fromAddress,
    toAddress,
    startTime,
    endTime,
    transactionType,
  };

  return (
    <Stack gap={24} fontFamily="var(--font-instrument-sans)">
      <Stack gap={3}>
        <SearchHeader resultCount={resultCount} />
        <SearchFiltersDisplay filters={filters} />
        <SearchContent onTotalChange={setResultCount} />
      </Stack>
    </Stack>
  );
}

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
