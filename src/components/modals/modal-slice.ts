import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { MODALS } from '@common/constants';
import { useAppSelector } from '@common/state/hooks';

interface State {
  openedModal: MODALS | null;
}

const initialState: State = {
  openedModal: null,
};

export const modalSlice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    openModal: (state, action: PayloadAction<MODALS>) => {
      state.openedModal = action.payload;
    },
    closeModal: state => {
      state.openedModal = null;
    },
  },
});

export const { openModal, closeModal } = modalSlice.actions;

export const selectOpenedModal = () => useAppSelector(state => state.modal.openedModal);
