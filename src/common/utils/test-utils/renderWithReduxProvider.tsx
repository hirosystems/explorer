import type { PreloadedState } from '@reduxjs/toolkit';
import { configureStore } from '@reduxjs/toolkit';
import type { RenderOptions } from '@testing-library/react';
import { render } from '@testing-library/react';
import React, { PropsWithChildren } from 'react';
import { Provider } from 'react-redux';

import {
  sandboxSlice,
  initialState as sandboxSliceInitialState,
} from '../../../app/sandbox/sandbox-slice';
import {
  searchSlice,
  initialState as searchSliceInitialState,
} from '../../../features/search/search-slice';
import {
  TxFilterAndSortTypes,
  TxFilters,
  filterAndSortReducers,
  initialState as filterSliceInitialState,
} from '../../../features/txsFilterAndSort/txsFilterAndSortSlice';
import {
  modalSlice,
  initialState as modalSliceInitialState,
} from '../../components/modals/modal-slice';
import {
  initialState as activeTransactionValueFilterInitialState,
  activeTransactionValueFilterSlice,
} from '../../state/slices/transaction-value-filter-slice';
import { AppStore, RootState } from '../../state/store';

interface ExtendedRenderOptions extends Omit<RenderOptions, 'queries'> {
  preloadedState?: PreloadedState<RootState>;
  store?: AppStore;
}

export function renderWithReduxProviders(
  ui: React.ReactElement,
  {
    preloadedState = {
      modal: modalSliceInitialState,
      search: searchSliceInitialState,
      connect: sandboxSliceInitialState,
      activeTransactionValueFilter: activeTransactionValueFilterInitialState,
      ...Object.keys(TxFilterAndSortTypes).reduce(
        (acc, filterType) => ({ ...acc, [filterType]: filterSliceInitialState }),
        {} as TxFilters
      ),
    },
    store = configureStore({
      reducer: {
        modal: modalSlice.reducer,
        search: searchSlice.reducer,
        connect: sandboxSlice.reducer,
        activeTransactionValueFilter: activeTransactionValueFilterSlice.reducer,
        ...filterAndSortReducers,
      },
      preloadedState,
    }),
    ...renderOptions
  }: ExtendedRenderOptions = {}
) {
  function Wrapper({ children }: PropsWithChildren<{}>): JSX.Element {
    return <Provider store={store}>{children}</Provider>;
  }
  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) };
}
