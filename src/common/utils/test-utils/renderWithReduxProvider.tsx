import { configureStore } from '@reduxjs/toolkit';
import type { PreloadedState } from '@reduxjs/toolkit';
import { render } from '@testing-library/react';
import type { RenderOptions } from '@testing-library/react';
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
  TxFilterTypes,
  TxFilters,
  filterReducers,
  initialState as filterSliceInitialState,
} from '../../../features/txs-filter/transactions-filter-slice';
import {
  modalSlice,
  initialState as modalSliceInitialState,
} from '../../components/modals/modal-slice';
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
      ...Object.keys(TxFilterTypes).reduce(
        (acc, filterType) => ({ ...acc, [filterType]: filterSliceInitialState }),
        {} as TxFilters
      ),
    },
    store = configureStore({
      reducer: {
        modal: modalSlice.reducer,
        search: searchSlice.reducer,
        connect: sandboxSlice.reducer,
        ...filterReducers,
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
