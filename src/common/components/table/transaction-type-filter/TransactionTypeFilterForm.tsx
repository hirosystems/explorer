import { Checkbox, CheckboxProps } from '@/components/ui/checkbox';
import { useFilterAndSortState } from '@/features/txsFilterAndSort/useFilterAndSortState';
import { Button } from '@/ui/Button';
import { Text } from '@/ui/Text';
import ClarityIcon from '@/ui/icons/ClarityIcon';
import DiagonalArrowsIcon from '@/ui/icons/DiagonalArrowsIcon';
import { Box, HStack, Icon, Stack, useCheckboxGroup } from '@chakra-ui/react';
import { ArrowsCounterClockwise, Cube, PhoneCall } from '@phosphor-icons/react';
import { ReactNode, useEffect } from 'react';

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

export function TransactionTypeFilterForm({
  onSubmit,
  open,
}: {
  onSubmit: () => void;
  open: boolean;
}) {
  const { activeFilters, setActiveFilters } = useFilterAndSortState();

  const {
    value: selectedFilters,
    getItemProps: getCheckboxProps,
    setValue: setSelectedFilters,
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
        <Button
          w="full"
          variant="redesignSecondary"
          size="sm"
          onClick={() => {
            setActiveFilters(selectedFilters);
            onSubmit();
          }}
        >
          Apply
        </Button>
      </Box>
    </Stack>
  );
}
