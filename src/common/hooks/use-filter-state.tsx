import { useCallback } from 'react';
import { useRecoilCallback, useRecoilState } from 'recoil';

import type { TxTypeFilterOptions } from '@store/recoil/filter';
import { filterState } from '@store/recoil/filter';

export const useFilterState = (key: 'sandbox' | 'txList', showCoinbase = false) => {
  const [filter, setFilterState] = useRecoilState(filterState(key));

  const handleToggleFilterPanelVisibility = useCallback(() => {
    setFilterState(state => ({ ...state, showing: !state.showing }));
  }, [setFilterState]);

  const handleToggleShowPending = useCallback(
    () => setFilterState(state => ({ ...state, showPending: !state.showPending })),
    [setFilterState]
  );

  const handleToggleShowShowFailed = useCallback(
    () => setFilterState(state => ({ ...state, showFailed: !state.showFailed })),
    [setFilterState]
  );

  const handleUpdateTypes = useRecoilCallback(
    ({ snapshot, set }) =>
      (type, enabled) => {
        const filters = snapshot.getLoadable(filterState(key)).contents;
        if ('types' in filters && filters.types) {
          if (enabled) {
            const newTypes: TxTypeFilterOptions = [
              ...new Set([...filters.types, type]),
            ] as TxTypeFilterOptions;

            return set(filterState(key), s => ({
              ...s,
              types: newTypes,
            }));
          }
          return set(filterState(key), s => ({
            ...s,
            types: filters.types.filter(_type => type !== _type),
          }));
        }
      },
    [key]
  );

  const handleClose = useCallback(() => {
    setFilterState(s => ({ ...s, showing: false }));
  }, [setFilterState]);
  const handleOpen = useCallback(() => {
    setFilterState(s => ({ ...s, showing: true }));
  }, [setFilterState]);

  return {
    handleToggleFilterPanelVisibility,
    handleToggleShowPending,
    handleToggleShowShowFailed,
    handleUpdateTypes,
    handleClose,
    handleOpen,
    ...filter,
    types: [...filter.types].filter(t => t),
  };
};
