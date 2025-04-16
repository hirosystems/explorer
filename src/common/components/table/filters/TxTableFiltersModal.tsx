'use client';

import { TxPageFilters } from '@/app/transactions/page';
import { useOpenedModal } from '@/common/components/modals/modal-slice';
import { MODALS } from '@/common/constants/constants';
import { AccordionRoot } from '@/components/ui/accordion';
import { RedesignModal } from '@/ui/RedesignModal';
import { Text } from '@/ui/Text';
import { Stack } from '@chakra-ui/react';
import { useMemo, useState } from 'react';

import { AddressFilterAccordionItem } from './address-filter/AddressFilterAccordionItem';
import { DateFilterAccordionItem } from './date-filter/DateFilterAccordionItem';
import { TransactionTypeFilterAccordionItem } from './transaction-type-filter/TransactionTypeFilterAccordionItem';

type AccordionItem =
  | 'date-filter-accordion-item'
  | 'address-filter-accordion-item'
  | 'transaction-type-filter-accordion-item';

const TxTableFiltersModalBody = ({ filters }: { filters: TxPageFilters }) => {
  const {
    startTime: defaultStartTime,
    endTime: defaultEndTime,
    fromAddress: defaultFromAddress,
    toAddress: defaultToAddress,
  } = filters;
  const [accordions, setAccordions] = useState<AccordionItem[]>([]);

  return (
    <AccordionRoot
      multiple
      mt={0}
      defaultValue={undefined}
      value={accordions}
      onValueChange={({ value }) => {
        setAccordions(value as AccordionItem[]);
      }}
    >
      <Stack gap={4}>
        <DateFilterAccordionItem
          id="date-filter-accordion-item"
          defaultStartTime={defaultStartTime}
          defaultEndTime={defaultEndTime}
          open={accordions.includes('date-filter-accordion-item')}
          onSubmit={() =>
            setAccordions(
              accordions.filter(accordion => accordion !== 'date-filter-accordion-item')
            )
          }
        />
        <AddressFilterAccordionItem
          id="address-filter-accordion-item"
          defaultFromAddress={defaultFromAddress}
          defaultToAddress={defaultToAddress}
          open={accordions.includes('address-filter-accordion-item')}
          onSubmit={() =>
            setAccordions(
              accordions.filter(accordion => accordion !== 'address-filter-accordion-item')
            )
          }
        />
        <TransactionTypeFilterAccordionItem
          id="transaction-type-filter-accordion-item"
          open={accordions.includes('transaction-type-filter-accordion-item')}
          onSubmit={() =>
            setAccordions(
              accordions.filter(accordion => accordion !== 'transaction-type-filter-accordion-item')
            )
          }
        />
      </Stack>
    </AccordionRoot>
  );
};

export const TxTableFiltersModal = ({ filters }: { filters: TxPageFilters }) => {
  const modal = useOpenedModal();
  const open = useMemo(() => modal === MODALS.TxsTableFilters, [modal]);

  return (
    <RedesignModal
      open={open}
      title={
        <Text fontSize={'3.5xl'} fontFamily="matter" fontWeight="regular">
          Filter
        </Text>
      }
      body={<TxTableFiltersModalBody filters={filters} />}
    />
  );
};
