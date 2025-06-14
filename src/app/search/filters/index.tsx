import { AddressFilterPopover } from '@/common/components/table/filters/address-filter/AddressFilterPopover';
import { DateFilterPopover } from '@/common/components/table/filters/date-filter/DateFilterPopover';
import {
  useAddressFilterHandler,
  useClearAddressFilterHandler,
  useClearDateFilterHandler,
  useDateFilterHandler,
} from '@/common/components/table/filters/table-filters-utils';
import { Flex, Icon, Stack } from '@chakra-ui/react';
import { Backspace, FunnelSimple } from '@phosphor-icons/react';
import { usePathname, useSearchParams } from 'next/navigation';

import { filterToFormattedValueMap } from '../../../common/queries/useSearchQuery';
import { Text } from '../../../ui/Text';
import { TextLink } from '../../../ui/TextLink';

export interface FilterProps {
  filters: Record<string, string | undefined>;
}

function usePageUrlWithNoFilters() {
  const currentPath = usePathname();
  const searchParams = useSearchParams();
  const currentQuery = new URLSearchParams(searchParams);

  Object.keys(filterToFormattedValueMap).forEach(param => {
    currentQuery.delete(param);
  });

  const queryString = currentQuery.toString();
  return `${currentPath}${queryString ? `?${queryString}` : ''}`;
}

export function ClearFiltersButton({ filters }: FilterProps) {
  const pageUrlWithNoFilters = usePageUrlWithNoFilters();
  if (!Object.keys(filters).length) return null;
  return (
    <Flex gap={2} alignItems={'center'}>
      <TextLink
        href={pageUrlWithNoFilters}
        width={'full'}
        fontSize={'sm'}
        fontWeight={'medium'}
        display={'flex'}
        gap={1.5}
        color="textSubdued"
      >
        <Icon h={4} w={4}>
          <Backspace />
        </Icon>
        <span>Clear all filters</span>
      </TextLink>
    </Flex>
  );
}

export function FiltersWithWrapper({ filters }: FilterProps) {
  const addressFilterHandler = useAddressFilterHandler(false);
  const dateFilterHandler = useDateFilterHandler(false);
  const clearDateFilterHandler = useClearDateFilterHandler(false);
  const clearAddressFilterHandler = useClearAddressFilterHandler(false);

  return (
    <Stack
      gap={4}
      pt={5}
      pl={6}
      pr={6}
      pb={6}
      boxShadow={'0px 4px 10px 2px rgba(0, 0, 0, 0.03)'}
      rounded={'xl'}
      border="normal"
    >
      <Flex justifyContent={'space-between'}>
        <Flex gap={2} alignItems={'center'} color={'text'}>
          <Icon h={4} w={4}>
            <FunnelSimple />
          </Icon>
          <Text fontSize={'sm'} fontWeight={'medium'} lineHeight={'1.43em'}>
            Filters
          </Text>
        </Flex>
        <ClearFiltersButton filters={filters} />
      </Flex>
      <Flex gap={2} mt={0.5} direction={['column', 'row']}>
        <AddressFilterPopover
          defaultFromAddress={filters.fromAddress}
          defaultToAddress={filters.toAddress}
          onSubmit={addressFilterHandler}
          clearFilterHandler={clearAddressFilterHandler}
        />
        <DateFilterPopover
          defaultStartTime={filters.startTime}
          defaultEndTime={filters.endTime}
          onSubmit={dateFilterHandler}
          clearFilterHandler={clearDateFilterHandler}
        />
      </Flex>
    </Stack>
  );
}
