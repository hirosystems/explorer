import { Checkbox, CheckboxProps } from '@/components/ui/checkbox';
import { useFilterAndSortState } from '@/features/txsFilterAndSort/useFilterAndSortState';
import { Button } from '@/ui/Button';
import { Text } from '@/ui/Text';
import ClarityIcon from '@/ui/icons/ClarityIcon';
import DiagonalArrowsIcon from '@/ui/icons/DiagonalArrowsIcon';
import { Box, HStack, Icon, Stack, useCheckboxGroup } from '@chakra-ui/react';
import { ArrowsCounterClockwise, Cube, PhoneCall } from '@phosphor-icons/react';
import { ReactNode, useEffect } from 'react';

export const CheckboxItem = ({
  label,
  icon,
  value,
  checkboxProps,
  toggleSelectedFilter,
}: {
  label: string;
  icon: ReactNode;
  value: string;
  checkboxProps: CheckboxProps;
  toggleSelectedFilter: (value: string) => void;
}) => {
  return (
    <HStack
      gap={2}
      p={1.5}
      _hover={{ bg: 'surfaceTertiary' }}
      rounded={'md'}
      className="group"
      onClick={() => {
        toggleSelectedFilter(value);
      }}
      autoFocus={false}
    >
      <Checkbox checked={checkboxProps.checked} variant="redesignPrimary" autoFocus={false} />
      <Icon
        h={4}
        w={4}
        color={checkboxProps.checked ? 'iconPrimary' : 'iconSecondary'}
        _groupHover={{ color: 'iconPrimary' }}
      >
        {icon}
      </Icon>
      <Text
        textStyle="text-medium-sm"
        color={checkboxProps.checked ? 'textPrimary' : 'textSecondary'}
        _groupHover={{ color: 'textPrimary' }}
        whiteSpace="nowrap"
      >
        {label}
      </Text>
    </HStack>
  );
};

export function TransactionTypeFilterForm({
  onSubmit,
  open,
}: {
  onSubmit?: () => void;
  open: boolean;
}) {
  const { activeFilters, setActiveFilters } = useFilterAndSortState();

  const {
    value: selectedFilters,
    getItemProps: getCheckboxProps,
    setValue: setSelectedFilters,
    toggleValue: toggleSelectedFilter,
  } = useCheckboxGroup({
    defaultValue: activeFilters,
  });

  useEffect(() => {
    const unappliedFilters = selectedFilters.filter(
      selectedFilter => !activeFilters.includes(selectedFilter)
    );
    if (!open && unappliedFilters.length > 0) {
      setSelectedFilters(activeFilters);
    }
  }, [open, selectedFilters, activeFilters, setSelectedFilters]);

  return (
    <Stack gap={1.5}>
      <CheckboxItem
        label={'Token transfer'}
        icon={<DiagonalArrowsIcon />}
        value={'token_transfer'}
        checkboxProps={getCheckboxProps({ value: 'token_transfer' })}
        toggleSelectedFilter={toggleSelectedFilter}
      />
      <CheckboxItem
        label={'Contract call'}
        icon={<PhoneCall />}
        value={'contract_call'}
        checkboxProps={getCheckboxProps({ value: 'contract_call' })}
        toggleSelectedFilter={toggleSelectedFilter}
      />

      <CheckboxItem
        label={'Contract deploy'}
        icon={<ClarityIcon />}
        value={'smart_contract'}
        checkboxProps={getCheckboxProps({ value: 'smart_contract' })}
        toggleSelectedFilter={toggleSelectedFilter}
      />

      <CheckboxItem
        label={'Tenure change'}
        icon={<ArrowsCounterClockwise />}
        value={'tenure_change'}
        checkboxProps={getCheckboxProps({ value: 'tenure_change' })}
        toggleSelectedFilter={toggleSelectedFilter}
      />
      <CheckboxItem
        label={'Coinbase'}
        icon={<Cube />}
        value={'coinbase'}
        checkboxProps={getCheckboxProps({ value: 'coinbase' })}
        toggleSelectedFilter={toggleSelectedFilter}
      />

      <Box pt={1.5} px={1.5}>
        <Button
          w="full"
          variant="redesignSecondary"
          size="small"
          onClick={() => {
            setActiveFilters(selectedFilters);
            onSubmit?.();
          }}
        >
          Apply
        </Button>
      </Box>
    </Stack>
  );
}
