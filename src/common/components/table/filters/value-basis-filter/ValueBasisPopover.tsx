import { useAppSelector } from '@/common/state/hooks';
import { Text } from '@/ui/Text';
import { useCallback } from 'react';

import { TableTabPopover } from '../TableTabPopover';
import { ValueBasisFilterForm, getActiveTransactionValueFilterLabel } from './ValueBasisFilterForm';

const TAB_HEIGHT_ADJUSTMENT = 4;

export function ValueBasisFilterPopover() {
  const activeTransactionValueFilter = useAppSelector(
    state => state.activeTransactionValueFilter.activeTransactionValueFilter
  );

  const filterLabel = useCallback(
    () => getActiveTransactionValueFilterLabel(activeTransactionValueFilter),
    [activeTransactionValueFilter]
  );

  const filterLabelValue = typeof filterLabel === 'function' ? filterLabel?.() : filterLabel;

  return (
    <TableTabPopover
      id={'value-basis-filter-popover'}
      positioning={{ placement: 'bottom-end', offset: { mainAxis: TAB_HEIGHT_ADJUSTMENT } }}
      trigger={(open, setOpen) => (
        <Text textStyle="text-medium-sm" color={open ? 'textPrimary' : 'textSecondary'}>
          {filterLabelValue}
        </Text>
      )}
      content={(open, setOpen) => (
        <ValueBasisFilterForm
          onSubmit={() => {
            setOpen(false);
          }}
        />
      )}
      contentProps={{ minW: '180px' }}
    />
  );
}
