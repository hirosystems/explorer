import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { MODALS } from '@common/constants';
import { useAppSelector } from '@common/state/hooks';

interface State {
  openedModal?: MODALS;
}

const initialState: State = {
  openedModal: undefined,
};

export const modalSlice = createSlice({
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

export const { openModal, closeModal } = modalSlice.actions;

export const selectOpenedModal = () => useAppSelector(state => state.modal.openedModal);
