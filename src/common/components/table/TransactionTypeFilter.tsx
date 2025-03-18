import { TransactionValueFilterTypes } from '@/common/state/slices/transaction-value-filter-slice';
import { capitalize } from '@/common/utils/utils';
import { Checkbox, CheckboxProps } from '@/components/ui/checkbox';
import { useFilterAndSortState } from '@/features/txsFilterAndSort/useFilterAndSortState';
import { Button } from '@/ui/Button';
import { Text } from '@/ui/Text';
import ClarityIcon from '@/ui/icons/ClarityIcon';
import CubeSparkleIcon from '@/ui/icons/CubeSparkleIcon';
import DiagonalArrowsIcon from '@/ui/icons/DiagonalArrowsIcon';
import FunctionXIcon from '@/ui/icons/FunctionX';
import { Box, HStack, Icon, Stack, useCheckboxGroup } from '@chakra-ui/react';
import {
  ArrowBendDownRight,
  ArrowsCounterClockwise,
  Cube,
  PhoneCall,
  Question,
} from '@phosphor-icons/react';
import { ReactNode, useState } from 'react';

import {
  GooseNeckPopoverContent,
  GooseNeckPopoverRoot,
  GooseNeckPopoverTrigger,
} from '../GooseNeckPopover';

function getFilterIcon(filter: string) {
  switch (filter) {
    case 'coinbase':
      return <CubeSparkleIcon />;
    case 'smart_contract':
      return <ClarityIcon />;
    case 'contract_call':
      return <FunctionXIcon />;
    case 'tenure_change':
      return <ArrowBendDownRight />;
    case 'contract_deploy':
      return <ClarityIcon />;
    case 'token_transfer':
      return <DiagonalArrowsIcon />;
    default:
      return <Question />;
  }
}

const CheckboxItem = ({
  label,
  icon,
  value,
  selectedFilters,
  checkboxProps,
}: {
  label: string;
  icon: ReactNode;
  value: string;
  selectedFilters: (string | number)[];
  checkboxProps: CheckboxProps;
}) => {
  const checked = selectedFilters.includes(value);
  return (
    <HStack gap={2} p={1.5} _hover={{ bg: 'surfaceTertiary' }} rounded={'md'} className="group">
      <Checkbox checked={checked} {...checkboxProps} variant="redesignPrimary" />
      <Icon h={4} w={4} color="iconSecondary" _groupHover={{ color: 'iconPrimary' }}>
        {icon}
      </Icon>
      <Text
        textStyle="text-medium-sm"
        color={checked ? 'textPrimary' : 'textSecondary'}
        _groupHover={{ color: 'textPrimary' }}
      >
        {label}
      </Text>
    </HStack>
  );
};

function getActiveTransactionValueFilterLabel(
  activeTransactionValueFilter: TransactionValueFilterTypes
) {
  if (activeTransactionValueFilter === TransactionValueFilterTypes.CurrentValue) {
    return 'Current value';
  }
  if (
    activeTransactionValueFilter === TransactionValueFilterTypes.EstimatedValueOnDayOfTransaction
  ) {
    return 'Est. value on tx day';
  }
  throw new Error('Invalid activeTransactionValueFilter');
}

export function TransactionTypeFilter() {
  const [open, setOpen] = useState(false);

  const { setActiveFilters, activeFilters } = useFilterAndSortState();

  const { value: selectedFilters, getItemProps: getCheckboxProps } = useCheckboxGroup({
    defaultValue: [],
    onValueChange: (value: string[]) => {
      setActiveFilters(value);
    },
  });

  const areFiltersActive = activeFilters.length > 0;
  const triggerTextPrefix = areFiltersActive ? 'Type: ' : 'Type';
  const firstActiveFilter = activeFilters[0];
  const firstActiveFilterFormatted = firstActiveFilter ? firstActiveFilter.replace(/_/g, ' ') : '';
  const otherActiveFilters = activeFilters.slice(1);
  const triggerTextSuffix =
    activeFilters.length > 1
      ? `${capitalize(firstActiveFilterFormatted)}, +${otherActiveFilters.length}`
      : capitalize(firstActiveFilterFormatted);

  return (
    <GooseNeckPopoverRoot
      id={'transaction-type-filter-popover'}
      open={open}
      onOpenChange={e => setOpen(e.open)}
    >
      <GooseNeckPopoverTrigger
        open={open}
        triggerText={open => (
          <>
            <Text
              textStyle="text-medium-sm"
              color={open ? 'textPrimary' : 'textSecondary'}
              _groupHover={{ color: 'textPrimary' }}
            >
              {triggerTextPrefix}
            </Text>
            {areFiltersActive && (
              <Text textStyle="text-medium-sm" color="textPrimary">
                {triggerTextSuffix}
              </Text>
            )}
          </>
        )}
      />
      <GooseNeckPopoverContent w="fit-content" minW={'190px'}>
        <Stack gap={1.5} px={1.5} pt={2} pb={3}>
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

          <Box pt={1.5} px={1.5}>
            <Button w="full" variant="redesignSecondary" size="sm" onClick={() => setOpen(false)}>
              Apply
            </Button>
          </Box>
        </Stack>
      </GooseNeckPopoverContent>
    </GooseNeckPopoverRoot>
  );
}
