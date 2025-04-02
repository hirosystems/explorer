import { useAppSelector } from '@/common/state/hooks';
import { useCallback } from 'react';

import { FilterTabPopover, getFilterTabPopoverContainerProps } from '../FilterTabPopover';
import { FilterTrigger } from '../FilterTrigger';
import { ValueBasisFilterForm, getActiveTransactionValueFilterLabel } from './ValueBasisFilterForm';

const TAB_HEIGHT_ADJUSTMENT = 4;

export function ValueBasisFilterPopover({ idExtension = '' }: { idExtension?: string }) {
  const activeTransactionValueFilter = useAppSelector(
    state => state.activeTransactionValueFilter.activeTransactionValueFilter
  );

  const filterLabel = useCallback(
    () => getActiveTransactionValueFilterLabel(activeTransactionValueFilter),
    [activeTransactionValueFilter]
  );

  const filterLabelValue = typeof filterLabel === 'function' ? filterLabel?.() : filterLabel;

  return (
    <FilterTabPopover
      id={`value-basis-filter-popover${idExtension ? `-${idExtension}` : ''}`}
      positioning={{
        placement: 'bottom-end',
        offset: { mainAxis: TAB_HEIGHT_ADJUSTMENT },
        sameWidth: true,
      }}
      trigger={(open, setOpen) => (
        <FilterTrigger
          prefix=""
          value={filterLabelValue}
          open={open}
          setOpen={setOpen}
          containerProps={getFilterTabPopoverContainerProps}
        />
      )}
      content={(open, setOpen) => (
        <ValueBasisFilterForm
          onSubmit={() => {
            setOpen(false);
          }}
        />
      )}
    />
  );
}
