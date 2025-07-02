import { Checkbox, CheckboxProps } from '@/components/ui/checkbox';
import { Button } from '@/ui/Button';
import { Text } from '@/ui/Text';
import DiagonalArrowsIcon from '@/ui/icons/DiagonalArrowsIcon';
import { Box, HStack, Icon, Stack, useCheckboxGroup } from '@chakra-ui/react';
import { Fire, Sparkle } from '@phosphor-icons/react';
import { ReactNode, useEffect, useRef } from 'react';

import { TransactionEventType } from '@stacks/stacks-blockchain-api-types';

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

export function EventAssetTypeFilterForm({
  // TODO: shared with TransactionTypeFilterForm
  onSubmit,
  open,
  defaultEventAssetTypes,
}: {
  onSubmit?: (eventTypes: TransactionEventType[]) => void;
  open: boolean;
  defaultEventAssetTypes: TransactionEventType[];
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
    setSelectedFilters(defaultEventAssetTypes || []);
  }, [defaultEventAssetTypes, setSelectedFilters]);

  // Resets the selected filters when the form is closed
  useEffect(() => {
    if (prevOpenRef.current && !open) {
      setSelectedFilters(defaultEventAssetTypes || []);
    }
    prevOpenRef.current = open;
  }, [open, setSelectedFilters, defaultEventAssetTypes]);

  return (
    <Stack gap={1.5}>
      <CheckboxItem
        label={'Smart Contract Log'}
        icon={<DiagonalArrowsIcon />}
        value={'smart_contract_log'}
        checkboxProps={getCheckboxProps({ value: 'smart_contract_log' })}
        toggleSelectedFilter={toggleSelectedFilter}
      />
      <CheckboxItem
        label={'STX Lock'}
        icon={<Sparkle />}
        value={'stx_lock'}
        checkboxProps={getCheckboxProps({ value: 'stx_lock' })}
        toggleSelectedFilter={toggleSelectedFilter}
      />
      <CheckboxItem
        label={'STX Asset'}
        icon={<Fire />}
        value={'stx_asset'}
        checkboxProps={getCheckboxProps({ value: 'stx_asset' })}
        toggleSelectedFilter={toggleSelectedFilter}
      />
      <CheckboxItem
        label={'Fungible Token Asset'}
        icon={<Fire />}
        value={'fungible_token_asset'}
        checkboxProps={getCheckboxProps({ value: 'fungible_token_asset' })}
        toggleSelectedFilter={toggleSelectedFilter}
      />
      <CheckboxItem
        label={'Non-Fungible Token Asset'}
        icon={<Fire />}
        value={'non_fungible_token_asset'}
        checkboxProps={getCheckboxProps({ value: 'non_fungible_token_asset' })}
        toggleSelectedFilter={toggleSelectedFilter}
      />

      <Box pt={1.5} px={1.5}>
        <Button
          w="full"
          variant="redesignSecondary"
          size="small"
          onClick={() => {
            onSubmit?.(selectedFilters as TransactionEventType[]);
          }}
        >
          Apply
        </Button>
      </Box>
    </Stack>
  );
}
