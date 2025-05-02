import { TxPageFilters } from '@/app/transactions/page';
import { useFilterAndSortState } from '@/features/txsFilterAndSort/useFilterAndSortState';
import { Button } from '@/ui/Button';
import { Text } from '@/ui/Text';
import { Flex, Icon } from '@chakra-ui/react';
import { X } from '@phosphor-icons/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

const filterSearchParams = ['fromAddress', 'toAddress', 'startTime', 'endTime', 'transactionType'];

function getSearchParamsWithoutFilters(searchParams: URLSearchParams) {
  const params = new URLSearchParams(searchParams);
  filterSearchParams.forEach(param => {
    params.delete(param);
  });
  return params;
}

function useClearSearchParamFiltersHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const paramsWithoutFilters = getSearchParamsWithoutFilters(searchParams);
  return () => router.push(`?${paramsWithoutFilters.toString()}`, { scroll: false });
}

function useSearchParamsFilters() {
  const searchParams = useSearchParams();
  const filters: string[] = [];
  filterSearchParams.forEach(param => {
    if (searchParams.has(param)) {
      filters.push(param);
    }
  });
  return filters;
}

function useClearFilters() {
  const clearSearchParamFilters = useClearSearchParamFiltersHandler();
  const { setActiveFilters } = useFilterAndSortState();
  return () => {
    setActiveFilters([]);
    clearSearchParamFilters();
  };
}
export function ClearFiltersButton({ filters }: { filters: TxPageFilters }) {
  const [filtersActive, setFiltersActive] = useState<boolean>(Object.keys(filters).length > 0);
  const { activeFilters } = useFilterAndSortState();
  const searchParamFilters = useSearchParamsFilters();
  const clearFilters = useClearFilters();

  useEffect(() => {
    if (activeFilters.length > 0 || searchParamFilters.length > 0) {
      setFiltersActive(true);
    } else {
      setFiltersActive(false);
    }
  }, [activeFilters, searchParamFilters]);

  if (!filtersActive) {
    return null;
  }

  return (
    <Button
      borderRadius="redesign.lg"
      py={1}
      px={3}
      onClick={clearFilters}
      variant="redesignTertiary"
      size="small"
      boxSizing="border-box"
      alignItems="center"
      h="full"
    >
      <Flex gap={1.5} alignItems={'center'}>
        <Text textStyle="text-medium-sm" color="textSecondary">
          Clear all filters
        </Text>
        <Icon h={3} w={3} color="iconSecondary">
          <X />
        </Icon>
      </Flex>
    </Button>
  );
}
