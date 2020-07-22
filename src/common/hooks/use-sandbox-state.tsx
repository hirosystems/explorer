import { useSelector } from 'react-redux';
import { unwrapResult } from '@reduxjs/toolkit';

import { useDispatch } from '@common/hooks/use-dispatch';
import { RootState } from '@store';

import debounce from 'awesome-debounce-promise';

import {
  selectAccountBalance,
  selectAccountLoading,
  selectAccountNonce,
  selectAccountTransactions,
  selectErrorState,
  selectIdentity,
  selectLastFetch,
  selectLocalNonce,
  setLocalNonce,
  resetLocalNonce,
  setIdentity,
  setUserData,
  generateIdentity,
  fetchAccount,
  requestFaucetFunds,
  broadcastTransaction,
  BroadcastTxOptions,
  clearAccountError,
  selectUserData,
} from '@store/sandbox';

import { IdentityPayload, Account } from '@store/sandbox/types';
import { UserData } from 'blockstack/lib/auth/authApp';
import { UserSession } from 'blockstack/lib';
import { identityStorage, USERNAME_COOKIE, IDENTITY_COOKIE, usernameStorage } from '@common/utils';

interface SanboxStateValues {
  lastFetch?: number;
  loading: string;
  balance?: string;
  transactions?: any;
  nonce?: number;
  localNonce?: number;
  identity?: IdentityPayload;
  user?: UserData;
  error?: any;
}

export const useSandboxStateValues = (): SanboxStateValues => {
  const {
    lastFetch,
    loading,
    balance,
    identity,
    user,
    localNonce,
    transactions,
    error,
  } = useSelector((state: RootState) => {
    const identity = selectIdentity(state);
    return {
      lastFetch: selectLastFetch(state),
      loading: selectAccountLoading(state),
      balance: selectAccountBalance(identity?.address || '')(state),
      transactions: selectAccountTransactions(identity?.address || '')(state),
      nonce: selectAccountNonce(identity?.address || '')(state),
      user: selectUserData(state),
      localNonce: selectLocalNonce(state),
      identity,
      error: selectErrorState(state),
    };
  });

  return { lastFetch, loading, balance, transactions, user, identity, localNonce, error };
};

interface UseSandboxState extends SanboxStateValues {
  doIncrementLocalNonce: (nonce: number) => void;
  doResetLocalNonce: () => void;
  doSetIdentity: (identity: IdentityPayload) => void;
  doSetUserData: (userData: UserData) => void;
  doGenerateIdentity: (userSession: UserSession) => Promise<IdentityPayload>;
  doFetchAccount: (principal?: string) => Promise<Partial<Account>>;
  doRequestFaucetFunds: (principal: string) => Promise<Partial<Account>>;
  doBroadcastTransaction: (options: BroadcastTxOptions) => Promise<Partial<Account>>;
  doClearAccountError: () => void;
}

export const useSandboxState = (): UseSandboxState => {
  const dispatch = useDispatch();
  const stateValues = useSandboxStateValues();

  const doIncrementLocalNonce = (nonce: number) => {
    dispatch(setLocalNonce(nonce));
  };
  const doResetLocalNonce = () => dispatch(resetLocalNonce);
  const doSetIdentity = (identity: IdentityPayload) => {
    if (!stateValues.identity) {
      identityStorage.set(IDENTITY_COOKIE, identity);
      dispatch(setIdentity(identity));
    }
  };
  const doSetUserData = (userData: UserData) => {
    if (!stateValues?.user) {
      usernameStorage.set(USERNAME_COOKIE, userData.username || userData.identityAddress);
      dispatch(setUserData(userData));
    }
  };
  const doGenerateIdentity = debounce(async (userSession: UserSession) => {
    if (stateValues.identity) return stateValues.identity;
    const response = await dispatch(generateIdentity(userSession));
    const value = unwrapResult(response);
    doSetIdentity(value);
    return value;
  }, 100);

  const doFetchAccount = async (principal?: string) => {
    const address = stateValues.identity && stateValues.identity.address;
    const response = await dispatch(fetchAccount(principal || (address as string)));
    const value = unwrapResult(response);
    return value;
  };
  const doRequestFaucetFunds = async (principal: string) => {
    const response = await dispatch(requestFaucetFunds(principal));
    const value = unwrapResult(response);
    return value;
  };
  const doBroadcastTransaction = async (options: BroadcastTxOptions) => {
    const response = await dispatch(broadcastTransaction(options));
    const value = unwrapResult(response);
    return value;
  };
  const doClearAccountError = () => dispatch(clearAccountError);

  return {
    doIncrementLocalNonce,
    doResetLocalNonce,
    doSetIdentity,
    doSetUserData,
    doGenerateIdentity,
    doFetchAccount,
    doRequestFaucetFunds,
    doBroadcastTransaction,
    doClearAccountError,
    ...stateValues,
  };
};
