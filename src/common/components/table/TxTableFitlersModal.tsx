import { TxPageFilters } from '@/app/transactions/page';
import { closeModal, useOpenedModal } from '@/common/components/modals/modal-slice';
import { MODALS } from '@/common/constants/constants';
import { useAppDispatch } from '@/common/state/hooks';
import { AccordionRoot } from '@/components/ui/accordion';
import { useFilterAndSortState } from '@/features/txsFilterAndSort/useFilterAndSortState';
import { Button } from '@/ui/Button';
import { RedesignModal } from '@/ui/RedesignModal';
import { Text } from '@/ui/Text';
import { Stack } from '@chakra-ui/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useMemo, useState } from 'react';

import { TxTableFilterProvider, useTxTableFilters } from './TxTableFilterContext';
import { AddressFilterAccordionItem } from './filters/address-filter/AddressFilterAccordionItem';
import { getAddressFilterParams } from './filters/address-filter/AddressFilterForm';
import { DateFilterAccordionItem } from './filters/date-filter/DateFilterAccordionItem';
import { getDateFilterParams } from './filters/date-filter/DatePicker';
import { TransactionTypeFilterAccordionItem } from './filters/transaction-type-filter/TransactionTypeFilterAccordionItem';

const TxTableFiltersModalBody = ({ filters }: { filters: TxPageFilters }) => {
  const {
    startTime: defaultStartTime,
    endTime: defaultEndTime,
    fromAddress: defaultFromAddress,
    toAddress: defaultToAddress,
  } = filters;
  const dispatch = useAppDispatch();
  const [accordions, setAccordions] = useState<string[]>([]);
  const { filters: txTableFilters } = useTxTableFilters() || {};

  const transactionTypes = txTableFilters?.transactionTypes || [];
  const { setActiveFilters } = useFilterAndSortState();

  const searchParams = useSearchParams();
  const router = useRouter();

  const startTime = txTableFilters?.dates?.startTime || null;
  const endTime = txTableFilters?.dates?.endTime || null;

  const fromAddress = txTableFilters?.addresses?.fromAddress || '';
  const toAddress = txTableFilters?.addresses?.toAddress || '';

  return (
    <AccordionRoot
      multiple
      mt={4}
      defaultValue={undefined}
      onValueChange={({ value }) => {
        setAccordions(value);
      }}
    >
      <Stack gap={4}>
        <DateFilterAccordionItem
          id="date-filter-accordion-item"
          defaultStartTime={defaultStartTime}
          defaultEndTime={defaultEndTime}
          open={accordions.includes('date-filter-accordion-item')}
        />
        <AddressFilterAccordionItem
          id="address-filter-accordion-item"
          defaultFromAddress={defaultFromAddress}
          defaultToAddress={defaultToAddress}
          open={accordions.includes('address-filter-accordion-item')}
        />
        <TransactionTypeFilterAccordionItem
          id="transaction-type-filter-accordion-item"
          open={accordions.includes('transaction-type-filter-accordion-item')}
        />
        <Button
          w="fit-content"
          variant="redesignSecondary"
          size="sm"
          onClick={async () => {
            setActiveFilters?.(transactionTypes);

            const params = new URLSearchParams(searchParams);
            const paramsWithDateFilter = await getDateFilterParams(
              params,
              startTime ? Number(startTime) : null,
              endTime ? Number(endTime) : null
            );
            const paramsWithDateFilterAndAddressFilter = await getAddressFilterParams(
              paramsWithDateFilter,
              fromAddress,
              toAddress
            );
            router.push(`?${paramsWithDateFilterAndAddressFilter.toString()}`, { scroll: false });
            dispatch(closeModal());
          }}
        >
          Apply filters
        </Button>
      </Stack>
    </AccordionRoot>
  );
};

export const TxTableFiltersModal = ({ filters }: { filters: TxPageFilters }) => {
  const modal = useOpenedModal();
  const open = useMemo(() => modal === MODALS.TxsTableFilters, [modal]);

  return (
    <TxTableFilterProvider filters={filters}>
      <RedesignModal
        open={open}
        title={
          <Text fontSize={'3.5xl'} fontFamily="matter" fontWeight="regular">
            Filter
          </Text>
        }
        body={<TxTableFiltersModalBody filters={filters} />}
      />
    </TxTableFilterProvider>
  );
};
