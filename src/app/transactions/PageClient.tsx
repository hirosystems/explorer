'use client';

import { TxTableFilters } from '@/common/components/table/filters/TxTableFilters';
import { TxTableFiltersModal } from '@/common/components/table/filters/TxTableFiltersModal';
import { TxsTable } from '@/common/components/table/table-examples/TxsTable';
import { useGlobalContext } from '@/common/context/useGlobalContext';
import { GenericResponseType } from '@/common/hooks/useInfiniteQueryResult';
import { buildUrl } from '@/common/utils/buildUrl';
import { ButtonLink } from '@/ui/ButtonLink';
import { Text } from '@/ui/Text';
import { Flex, Stack } from '@chakra-ui/react';

import { CompressedTxTableData } from './utils';

export default function ({
  initialTxTableData,
}: {
  initialTxTableData: GenericResponseType<CompressedTxTableData> | undefined;
}) {
  const network = useGlobalContext().activeNetwork;

  return (
    <Stack gap={24} fontFamily="var(--font-instrument-sans)">
      {/* <Overview /> */}
      <Stack gap={8}>
        <Flex
          justifyContent={'space-between'}
          alignItems={{ base: 'flex-start', md: 'baseline' }}
          flexDirection={{ base: 'column', md: 'row' }}
          gap={4}
        >
          <Text textStyle="heading-md" color="textPrimary">
            Latest transactions
          </Text>
          <ButtonLink href={buildUrl('/mempool', network)} buttonLinkSize="big">
            View pending transactions in Mempool
          </ButtonLink>
        </Flex>
        <Stack gap={5}>
          <TxTableFilters />
          <TxsTable initialData={initialTxTableData} />
          <TxTableFiltersModal />
        </Stack>
      </Stack>
    </Stack>
  );
}
