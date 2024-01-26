import { useCallback, useMemo } from 'react';
import { PiCurrencyDollar } from 'react-icons/pi';

import { FilterMenu } from '../../common/components/FilterMenu';
import { useAppDispatch, useAppSelector } from '../../common/state/hooks';
import {
  TransactionValueFilterTypes,
  setTransactionValueFilter,
} from '../../common/state/slices/transaction-value-filter-slice';

function getActiveTransactionValueFilterLabel(
  activeTransactionValueFilter: TransactionValueFilterTypes
) {
  if (activeTransactionValueFilter === TransactionValueFilterTypes.CurrentValue) {
    return 'Current value';
  }
  if (
    activeTransactionValueFilter === TransactionValueFilterTypes.EstimatedValueOnDayOfTransaction
  ) {
    return 'Estimated value on day of transaction';
  }
  throw new Error('Invalid activeTransactionValueFilter');
}

export function ShowValueMenu() {
  const dispatch = useAppDispatch();
  const activeTransactionValueFilter = useAppSelector(
    state => state.activeTransactionValueFilter.activeTransactionValueFilter
  );
  const menuItems = useMemo(
    () =>
      Object.keys(TransactionValueFilterTypes).map(filterType => ({
        onClick: () =>
          dispatch(setTransactionValueFilter(filterType as TransactionValueFilterTypes)),
        label: getActiveTransactionValueFilterLabel(filterType as TransactionValueFilterTypes),
      })),
    [dispatch]
  );
  const filterLabel = useCallback(
    () => getActiveTransactionValueFilterLabel(activeTransactionValueFilter),
    [activeTransactionValueFilter]
  );

  return <FilterMenu filterLabel={filterLabel} menuItems={menuItems} leftIcon={PiCurrencyDollar} />;
}
