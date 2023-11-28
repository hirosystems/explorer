'use client';

import { PayloadAction, createSelector, createSlice } from '@reduxjs/toolkit';

import { AppConfig, UserData, UserSession, showConnect } from '@stacks/connect';
import { AuthOptions } from '@stacks/connect/dist/types/types/auth';

import { APP_DETAILS } from '../../common/constants/constants';
import { helloWorldContract } from '../../common/constants/contracts/hello-world-contract';
import { RootState } from '../../common/state/store';

export interface ConnectState {
  userSession: UserSession;
  userData: UserData | undefined;
  codeBody: string;
  showRightPanel: boolean;
  showCodeToolbar: boolean;
}

export const initialState: ConnectState = {
  userSession: new UserSession({ appConfig: new AppConfig(['store_write', 'publish_data']) }),
  userData: undefined,
  codeBody: helloWorldContract.source,
  showRightPanel: false,
  showCodeToolbar: false,
};

export const sandboxSlice = createSlice({
  name: 'connect',
  initialState,
  reducers: {
    connect: (
      state,
      action: PayloadAction<{
        activeNetworkMode: string;
        authOptions?: Partial<AuthOptions>;
      }>
    ) => {
      const defaultOptions: AuthOptions = {
        appDetails: APP_DETAILS,
        userSession: state.userSession,
      };
      showConnect(Object.assign(defaultOptions, action.payload.authOptions || {}));
    },
    disconnect: state => {
      console.log('[debug] disconnect');
      state.userSession.signUserOut();
      state.userData = undefined;
      state.showRightPanel = false;
    },
    setUserData: (state, action: PayloadAction<{ userData: UserData }>) => {
      state.userData = action.payload.userData;
    },
    setCodeBody: (state, action: PayloadAction<{ codeBody: string }>) => {
      state.codeBody = action.payload.codeBody;
    },
    toggleRightPanel: state => {
      state.showRightPanel = !state.showRightPanel;
    },
    toggleCodeToolbar: state => {
      state.showCodeToolbar = !state.showCodeToolbar;
    },
  },
});

export const {
  connect,
  disconnect,
  setUserData,
  setCodeBody,
  toggleRightPanel,
  toggleCodeToolbar,
} = sandboxSlice.actions;

export const selectConnectSlice = (state: RootState) => state.connect;

export const selectUserSession = createSelector(
  [selectConnectSlice],
  connectSlice => connectSlice.userSession
);

export const selectUserData = createSelector(
  [selectConnectSlice],
  connectSlice => connectSlice.userData
);

export const selectCodeBody = createSelector(
  [selectConnectSlice],
  connectSlice => connectSlice.codeBody
);

export const selectShowRightPanel = createSelector(
  [selectConnectSlice],
  connectSlice => connectSlice.showRightPanel
);

export const selectShowCodeToolbar = createSelector(
  [selectConnectSlice],
  connectSlice => connectSlice.showCodeToolbar
);
