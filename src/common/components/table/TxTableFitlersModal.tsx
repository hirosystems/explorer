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

const TxTableFiltersModalBody = ({ filters }: { filters: TxPageFilters }) => {
  const [tabs, setTabs] = useState<string[]>([]);
  const { startTime, endTime, fromAddress, toAddress } = filters;
  return (
    <Stack gap={4}>
      <AccordionRoot
        multiple
        mt={4}
        defaultValue={undefined}
        onValueChange={({ value }) => {
          setTabs(value);
        }}
      >
        <Stack gap={4}>
          <DateFilterAccordionItem
            id="date-filter-accordion-item"
            defaultStartTime={startTime}
            defaultEndTime={endTime}
            open={tabs.includes('date-filter-accordion-item')}
        />
        <AddressFilterAccordionItem
          id="address-filter-accordion-item"
          defaultFromAddress={fromAddress}
          defaultToAddress={toAddress}
            open={tabs.includes('address-filter-accordion-item')}
          />
          <TransactionTypeFilterAccordionItem
            id="transaction-type-filter-accordion-item"
            open={tabs.includes('transaction-type-filter-accordion-item')}
          />
        </Stack>
      </AccordionRoot>
    </Stack>
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
