import { useAppDispatch, useAppSelector } from '@/common/state/hooks';
import {
  TransactionValueFilterTypes,
  setTransactionValueFilter,
} from '@/common/state/slices/transaction-value-filter-slice';
import { Text } from '@/ui/Text';
import { Stack } from '@chakra-ui/react';
import { useCallback, useMemo, useState } from 'react';

import {
  GooseNeckPopoverContent,
  GooseNeckPopoverRoot,
  GooseNeckPopoverTrigger,
} from '../GooseNeckPopover';

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

export function ValueBasisFilter() {
  const [open, setOpen] = useState(false);

  const dispatch = useAppDispatch();
  const activeTransactionValueFilter = useAppSelector(
    state => state.activeTransactionValueFilter.activeTransactionValueFilter
  );
  const menuItems = useMemo(
    () =>
      Object.keys(TransactionValueFilterTypes).map(filterType => ({
        onClick: () => {
          dispatch(setTransactionValueFilter(filterType as TransactionValueFilterTypes));
          setOpen(false);
        },
        label: getActiveTransactionValueFilterLabel(filterType as TransactionValueFilterTypes),
      })),
    [dispatch]
  );
  const filterLabel = useCallback(
    () => getActiveTransactionValueFilterLabel(activeTransactionValueFilter),
    [activeTransactionValueFilter]
  );

  const filterLabelValue = typeof filterLabel === 'function' ? filterLabel?.() : filterLabel;
  const menuOnSelect = useCallback(() => {
    setOpen(false);
  }, []);

  return (
    <GooseNeckPopoverRoot
      id={'value-basis-filter-popover'}
      positioning={{ placement: 'bottom-end' }}
      open={open}
      onOpenChange={e => setOpen(e.open)}
    >
      <GooseNeckPopoverTrigger
        open={open}
        placement="bottom-end"
        triggerText={open => (
          <Text textStyle="text-medium-sm" color={open ? 'textPrimary' : 'textSecondary'}>
            {filterLabelValue}
          </Text>
        )}
      />
      <GooseNeckPopoverContent placement="bottom-end" w="fit-content" minW={'190px'}>
        <Stack gap={2.5} p={3} alignItems={'flex-end'}>
          {menuItems.map(item => (
            <Text
              key={item.label}
              onClick={item.onClick}
              textStyle="text-medium-sm"
              color="textSecondary"
              _hover={{ color: 'textPrimary' }}
              cursor={'pointer'}
              whiteSpace={'nowrap'}
            >
              {item.label}
            </Text>
          ))}
        </Stack>
      </GooseNeckPopoverContent>
    </GooseNeckPopoverRoot>
  );
}
