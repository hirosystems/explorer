import { PayloadAction, createSlice } from '@reduxjs/toolkit';

import { MODALS } from '../../constants/constants';
import { useAppSelector } from '../../state/hooks';

export interface ModalState {
  openedModal: MODALS | null;
}

export const initialState: ModalState = {
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

export const useOpenedModal = () => useAppSelector(state => state.modal.openedModal);
