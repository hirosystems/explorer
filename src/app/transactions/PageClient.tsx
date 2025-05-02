'use client';

import { TxTableFilters } from '@/common/components/table/filters/TxTableFilters';
import { TxTableFiltersModal } from '@/common/components/table/filters/TxTableFiltersModal';
import { TxsTable } from '@/common/components/table/table-examples/TxsTable';
import { useGlobalContext } from '@/common/context/useGlobalContext';
import { GenericResponseType } from '@/common/hooks/useInfiniteQueryResult';
import { buildUrl } from '@/common/utils/buildUrl';
import { NextLink } from '@/ui/NextLink';
import { Text } from '@/ui/Text';
import { Flex, Icon, Stack } from '@chakra-ui/react';
import { ArrowRight } from '@phosphor-icons/react';

import { TxPageFilters } from './page';
import { CompressedTxTableData } from './utils';

export default function ({
  filters,
  initialTxTableData,
}: {
  filters: TxPageFilters;
  initialTxTableData: GenericResponseType<CompressedTxTableData> | undefined;
}) {
  const network = useGlobalContext().activeNetwork;

  return (
    <Stack gap={24} fontFamily="var(--font-instrument-sans)">
      {/* <Overview /> */}
      <Stack gap={8}>
        <Flex
          justifyContent={'space-between'}
          alignItems={{ base: 'flex-start', md: 'flex-end' }}
          flexDirection={{ base: 'column', md: 'row' }}
          gap={4}
        >
          <Text textStyle="heading-md" color="textPrimary">
            Latest transactions
          </Text>
          <NextLink href={buildUrl('/mempool', network)} variant={'buttonLink'} size={'lg'}>
            <Flex gap={1.5} alignItems="center">
              <Text textStyle="text-medium-sm" color="textPrimary">
                View pending transactions in Mempool
              </Text>
              <Icon w={3.5} h={3.5}>
                <ArrowRight />
              </Icon>
            </Flex>
          </NextLink>
        </Flex>
        <Stack gap={5}>
          <TxTableFilters filters={filters} />
          <TxsTable filters={filters} initialData={initialTxTableData} />
          <TxTableFiltersModal filters={filters} />
        </Stack>
      </Stack>
    </Stack>
  );
}
