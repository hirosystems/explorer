import { Checkbox, CheckboxProps } from '@/components/ui/checkbox';
import { Button } from '@/ui/Button';
import { Text } from '@/ui/Text';
import DiagonalArrowsIcon from '@/ui/icons/DiagonalArrowsIcon';
import { Box, HStack, Icon, Stack, useCheckboxGroup } from '@chakra-ui/react';
import { Fire, Sparkle } from '@phosphor-icons/react';
import { ReactNode, useEffect, useRef } from 'react';

import { TransactionEventAssetType } from '@stacks/stacks-blockchain-api-types';

export const CheckboxItem = ({
  // TODO: shared with TransactionTypeFilterForm CheckboxItem
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

export function EventTypeFilterForm({
  // TODO: shared with TransactionTypeFilterForm
  onSubmit,
  open,
  defaultEventTypes,
}: {
  onSubmit?: (eventTypes: TransactionEventAssetType[]) => void;
  open: boolean;
  defaultEventTypes: TransactionEventAssetType[];
}) {
  const prevOpenRef = useRef(open);
  const {
    value: selectedFilters,
    getItemProps: getCheckboxProps,
    toggleValue: toggleSelectedFilter,
    setValue: setSelectedFilters,
  } = useCheckboxGroup();

  // Syncs the selected filters with the defaultTransactionType prop
  useEffect(() => {
    setSelectedFilters(defaultEventTypes || []);
  }, [defaultEventTypes, setSelectedFilters]);

  // Resets the selected filters when the form is closed
  useEffect(() => {
    if (prevOpenRef.current && !open) {
      setSelectedFilters(defaultEventTypes || []);
    }
    prevOpenRef.current = open;
  }, [open, setSelectedFilters, defaultEventTypes]);

  return (
    <Stack gap={1.5}>
      <CheckboxItem
        label={'Transfer'}
        icon={<DiagonalArrowsIcon />}
        value={'token_transfer'}
        checkboxProps={getCheckboxProps({ value: 'token_transfer' })}
        toggleSelectedFilter={toggleSelectedFilter}
      />
      <CheckboxItem
        label={'Mint'}
        icon={<Sparkle />}
        value={'mint'}
        checkboxProps={getCheckboxProps({ value: 'mint' })}
        toggleSelectedFilter={toggleSelectedFilter}
      />
      <CheckboxItem
        label={'Burn'}
        icon={<Fire />}
        value={'burn'}
        checkboxProps={getCheckboxProps({ value: 'burn' })}
        toggleSelectedFilter={toggleSelectedFilter}
      />

      <Box pt={1.5} px={1.5}>
        <Button
          w="full"
          variant="redesignSecondary"
          size="small"
          onClick={() => {
            onSubmit?.(selectedFilters as TransactionEventAssetType[]);
          }}
        >
          Apply
        </Button>
      </Box>
    </Stack>
  );
}
