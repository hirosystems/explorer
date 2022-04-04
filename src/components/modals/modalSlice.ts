import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { MODALS } from '@common/constants';
import { useAppSelector } from '@common/state/hooks';

export interface State {
  openedModal?: MODALS;
}

const initialState: State = {
  openedModal: undefined,
};

export const slice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    openModal: (state, action: PayloadAction<MODALS>) => {
      state.openedModal = action.payload;
    },
    closeModal: state => {
      state.openedModal = undefined;
    },
  },
});

export const { openModal, closeModal } = slice.actions;

export const selectOpenedModal = () => useAppSelector(state => state.modal.openedModal);

export default slice.reducer;
