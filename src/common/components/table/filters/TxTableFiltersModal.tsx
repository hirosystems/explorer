'use client';

import { useOpenedModal } from '@/common/components/modals/modal-slice';
import { useTxTableFilters } from '@/common/components/table/tx-table/useTxTableFilters';
import { MODALS } from '@/common/constants/constants';
import { AccordionRoot } from '@/components/ui/accordion';
import { Button } from '@/ui/Button';
import { RedesignModal } from '@/ui/RedesignModal';
import { Text } from '@/ui/Text';
import { Flex, Icon, Stack } from '@chakra-ui/react';
import { X } from '@phosphor-icons/react';
import { useEffect, useMemo, useState } from 'react';

import { areAnyTxTableFiltersActive } from '../tx-table/tx-table-filters-utils';
import { AddressFilterAccordionItem } from './address-filter/AddressFilterAccordionItem';
import { DateFilterAccordionItem } from './date-filter/DateFilterAccordionItem';
import { TransactionTypeFilterAccordionItem } from './transaction-type-filter/TransactionTypeFilterAccordionItem';

type AccordionItem =
  | 'date-filter-accordion-item'
  | 'address-filter-accordion-item'
  | 'transaction-type-filter-accordion-item';

const TxTableFiltersModalBody = () => {
  const [accordions, setAccordions] = useState<AccordionItem[]>([]);

  const {
    transactionType,
    startTime,
    endTime,
    fromAddress,
    toAddress,
    transactionTypeFilterHandler,
    dateFilterHandler,
    addressFilterHandler,
    clearAllFiltersHandler,
    clearDateFilterHandler,
    clearAddressFilterHandler,
    clearTransactionTypeFilterHandler,
  } = useTxTableFilters();

  useEffect(() => {
    console.log({ accordions });
  }, [accordions]);

  return (
    <AccordionRoot
      multiple
      mt={0}
      defaultValue={undefined}
      value={accordions}
      onValueChange={({ value }) => {
        console.log('onValueChange', value);
        // setAccordions(value as AccordionItem[]);
      }}
    >
      <Stack gap={4}>
        <TransactionTypeFilterAccordionItem
          id="transaction-type-filter-accordion-item"
          open={accordions.includes('transaction-type-filter-accordion-item')}
          onSubmit={(transactionType: string[]) => {
            transactionTypeFilterHandler(transactionType);
            setAccordions(
              accordions.filter(accordion => accordion !== 'transaction-type-filter-accordion-item')
            );
          }}
          clearFilterHandler={clearTransactionTypeFilterHandler}
          setOpen={open => {
            if (open) {
              setAccordions(accordions => [
                ...accordions,
                'transaction-type-filter-accordion-item',
              ]);
            } else {
              setAccordions(
                accordions.filter(
                  accordion => accordion !== 'transaction-type-filter-accordion-item'
                )
              );
            }
          }}
        />
        <DateFilterAccordionItem
          id="date-filter-accordion-item"
          open={accordions.includes('date-filter-accordion-item')}
          setOpen={open => {
            if (open) {
              setAccordions(accordions => [...accordions, 'date-filter-accordion-item']);
            } else {
              setAccordions(
                accordions.filter(accordion => accordion !== 'date-filter-accordion-item')
              );
            }
          }}
          clearFilterHandler={clearDateFilterHandler}
          onSubmit={(startTime?: number, endTime?: number) => {
            dateFilterHandler(startTime, endTime);
            setAccordions(
              accordions.filter(accordion => accordion !== 'date-filter-accordion-item')
            );
          }}
        />
        <AddressFilterAccordionItem
          id="address-filter-accordion-item"
          open={accordions.includes('address-filter-accordion-item')}
          setOpen={open => {
            if (open) {
              setAccordions(accordions => [...accordions, 'address-filter-accordion-item']);
            } else {
              setAccordions(
                accordions.filter(accordion => accordion !== 'address-filter-accordion-item')
              );
            }
          }}
          clearFilterHandler={clearAddressFilterHandler}
          onSubmit={(fromAddress: string, toAddress: string) => {
            addressFilterHandler(fromAddress, toAddress);
            setAccordions(
              accordions.filter(accordion => accordion !== 'address-filter-accordion-item')
            );
          }}
        />

        {areAnyTxTableFiltersActive({
          transactionType,
          fromAddress,
          toAddress,
          startTime,
          endTime,
        }) && (
          <Button
            variant="redesignTertiary"
            size="big"
            onClick={clearAllFiltersHandler}
            alignItems="center"
          >
            <Flex alignItems="center" gap={1.5}>
              <Text textStyle="text-medium-sm" color="textSecondary">
                Clear all filters
              </Text>
              <Icon h={3.5} w={3.5} color="iconSecondary">
                <X />
              </Icon>
            </Flex>
          </Button>
        )}
      </Stack>
    </AccordionRoot>
  );
};

export const TxTableFiltersModal = () => {
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
      body={<TxTableFiltersModalBody />}
    />
  );
};
