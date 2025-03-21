import { TxPageFilters } from '@/app/transactions/page';
import { useOpenedModal } from '@/common/components/modals/modal-slice';
import { MODALS } from '@/common/constants/constants';
import { AccordionRoot } from '@/components/ui/accordion';
import { Button } from '@/ui/Button';
import { RedesignModal } from '@/ui/RedesignModal';
import { Text } from '@/ui/Text';
import { Stack } from '@chakra-ui/react';
import { useMemo, useState } from 'react';

import { AddressFilterAccordionItem } from './address-filter/AddressFilterAccordionItem';
import { DateFilterAccordionItem } from './date-filter/DateFilterAccordionItem';
import { TransactionTypeFilterAccordionItem } from './transaction-type-filter/TransactionTypeFilterAccordionItem';

const applyAllFiltersHandler = () => {};

const TxTableFiltersModalBody = ({ filters }: { filters: TxPageFilters }) => {
  const [tabs, setTabs] = useState<string[]>([]);
  const { startTime, endTime, fromAddress, toAddress } = filters;
  const [startTime, setStartTime] = useState<string | null>(startTime);
  const [endTime, setEndTime] = useState<string | null>(endTime);
  const [fromAddress, setFromAddress] = useState<string | null>(fromAddress);
  const [toAddress, setToAddress] = useState<string | null>(toAddress);
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
            setStartTime={setStartTime}
            setEndTime={setEndTime}
          />
          <AddressFilterAccordionItem
            id="address-filter-accordion-item"
            defaultFromAddress={fromAddress}
            defaultToAddress={toAddress}
            open={tabs.includes('address-filter-accordion-item')}
            setFromAddress={setFromAddress}
            setToAddress={setToAddress}
          />
          <TransactionTypeFilterAccordionItem
            id="transaction-type-filter-accordion-item"
            open={tabs.includes('transaction-type-filter-accordion-item')}
            setActiveFilters={setActiveFilters}
          />
          <Button w="fit-content" variant="redesignSecondary" size="sm" onClick={() => {}}>
            Apply filters
          </Button>
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
