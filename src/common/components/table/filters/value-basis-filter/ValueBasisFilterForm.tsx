import { useAppDispatch } from '@/common/state/hooks';
import {
  TransactionValueFilterTypes,
  setTransactionValueFilter,
} from '@/common/state/slices/transaction-value-filter-slice';
import { Text } from '@/ui/Text';
import { Stack } from '@chakra-ui/react';
import { useMemo } from 'react';

export function getActiveTransactionValueFilterLabel(
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

export function ValueBasisFilterForm({ onSubmit }: { onSubmit?: () => void }) {
  const dispatch = useAppDispatch();
  const menuItems = useMemo(
    () =>
      Object.keys(TransactionValueFilterTypes).map(filterType => ({
        onClick: () => {
          dispatch(setTransactionValueFilter(filterType as TransactionValueFilterTypes));
          onSubmit?.();
        },
        label: getActiveTransactionValueFilterLabel(filterType as TransactionValueFilterTypes),
      })),
    [dispatch, onSubmit]
  );

  return (
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
  );
}
