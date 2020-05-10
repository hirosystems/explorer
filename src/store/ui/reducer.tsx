import { createReducer } from '@reduxjs/toolkit';
import { doAddToast, doRemoveToast, appTime } from '@store/ui/actions';
import { ToastType } from '@blockstack/ui';

interface UiState {
  toasts: ToastType[];
  appTime: number;
}

const initialState: UiState = {
  toasts: [],
  appTime: Math.round(new Date().getTime() / 1000),
};

export const uiReducer = createReducer(initialState, builder => {
  builder.addCase(doAddToast, (state, action) => {
    // @ts-ignore
    state.toasts.push(action.payload);
  });
  builder.addCase(doRemoveToast, (state, action) => {
    // @ts-ignore
    state.toasts = state.toasts.filter(({ id }) => id !== action.payload);
  });
  builder.addCase(appTime, (state, action) => {
    // @ts-ignore
    state.appTime = Math.round(new Date().getTime() / 1000);
  });
});
