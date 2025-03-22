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
import { useMemo, useState } from 'react';

import { TxTableFilterProvider, useTxTableFilters } from './TxTableFilterContext';
import { DateFilterAccordionItem } from './date-filter/DateFilterAccordionItem';
import { useHandleSubmit } from './date-filter/UnifiedDatePicker';
import { TransactionTypeFilterAccordionItem } from './transaction-type-filter/TransactionTypeFilterAccordionItem';

const TxTableFiltersModalBody = ({ serverFilters }: { serverFilters: TxPageFilters }) => {
  const [tabs, setTabs] = useState<string[]>([]);
  const {
    startTime: serverStartTime,
    endTime: serverEndTime,
    fromAddress: serverFromAddress,
    toAddress: serverToAddress,
  } = serverFilters;
  const { filters: txTableFilters } = useTxTableFilters() || {};
  const transactionTypes = txTableFilters?.transactionTypes || [];
  const startTime = txTableFilters?.dates?.startTime;
  const endTime = txTableFilters?.dates?.endTime;
  const mode = startTime && endTime ? 'between' : startTime ? 'after' : 'before';
  const handleDateFilterSubmit = useHandleSubmit(mode);

  
  const { setActiveFilters } = useFilterAndSortState();
  const dispatch = useAppDispatch();

  return (
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
        {/* <AddressFilterAccordionItem
          id="address-filter-accordion-item"
          defaultFromAddress={fromAddress}
          defaultToAddress={toAddress}
          open={tabs.includes('address-filter-accordion-item')}
        /> */}
        <TransactionTypeFilterAccordionItem
          id="transaction-type-filter-accordion-item"
          open={tabs.includes('transaction-type-filter-accordion-item')}
        />
        <Button
          w="fit-content"
          variant="redesignSecondary"
          size="sm"
          onClick={() => {
            if (transactionTypes && transactionTypes.length > 0) {
              setActiveFilters?.(transactionTypes);
            }
            if (startTime && endTime) {
              handleDateFilterSubmit({ startTime, endTime });
            }
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
        body={<TxTableFiltersModalBody serverFilters={filters} />}
      />
    </TxTableFilterProvider>
  );
};
