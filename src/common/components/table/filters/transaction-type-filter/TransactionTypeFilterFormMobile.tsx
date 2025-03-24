import ClarityIcon from '@/ui/icons/ClarityIcon';
import DiagonalArrowsIcon from '@/ui/icons/DiagonalArrowsIcon';
import { Stack, useCheckboxGroup } from '@chakra-ui/react';
import { ArrowsCounterClockwise, Cube, PhoneCall } from '@phosphor-icons/react';
import { useEffect } from 'react';

import { useTxTableFilters } from '../../TxTableFilterContext';
import { CheckboxItem } from './TransactionTypeFilterForm';

export function TransactionTypeFilterFormMobile() {
  const { filters, updateTransactionTypes } = useTxTableFilters() || {};

  const { value: selectedFilters, getItemProps: getCheckboxProps } = useCheckboxGroup({
    defaultValue: filters?.transactionTypes || [],
  });

  useEffect(() => {
    const unappliedFilters =
      selectedFilters.length !== filters?.transactionTypes.length ||
      selectedFilters.filter(selectedFilter => !filters?.transactionTypes.includes(selectedFilter))
        .length > 0;
    if (unappliedFilters) {
      updateTransactionTypes?.(selectedFilters);
    }
  }, [selectedFilters, filters, updateTransactionTypes]);

  return (
    <Stack gap={1.5}>
      <CheckboxItem
        label={'Token transfer'}
        icon={<DiagonalArrowsIcon />}
        value={'token_transfer'}
        selectedFilters={selectedFilters}
        checkboxProps={getCheckboxProps({ value: 'token_transfer' })}
      />
      <CheckboxItem
        label={'Contract call'}
        icon={<PhoneCall />}
        value={'contract_call'}
        selectedFilters={selectedFilters}
        checkboxProps={getCheckboxProps({ value: 'contract_call' })}
      />

      <CheckboxItem
        label={'Contract deploy'}
        icon={<ClarityIcon />}
        value={'smart_contract'}
        selectedFilters={selectedFilters}
        checkboxProps={getCheckboxProps({ value: 'smart_contract' })}
      />

      <CheckboxItem
        label={'Tenure change'}
        icon={<ArrowsCounterClockwise />}
        value={'tenure_change'}
        selectedFilters={selectedFilters}
        checkboxProps={getCheckboxProps({ value: 'tenure_change' })}
      />
      <CheckboxItem
        label={'Coinbase'}
        icon={<Cube />}
        value={'coinbase'}
        selectedFilters={selectedFilters}
        checkboxProps={getCheckboxProps({ value: 'coinbase' })}
      />
    </Stack>
  );
}
