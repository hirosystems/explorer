import { createAsyncThunk, createAction } from '@reduxjs/toolkit';
import BN from 'bn.js';
import { Account, AccountPayload, FaucetResponse, IdentityPayload } from '@store/sandbox/types';
import { fetchFromApi, postToSidecar } from '@common/api/fetch';
import { identityStorage, truncateMiddle } from '@common/utils';
import { doGenerateIdentity } from '@common/sandbox';
import {
  StacksTransaction,
  broadcastTransaction as broadcastTransactionBase,
} from '@blockstack/stacks-transactions';
import { network } from '@common/sandbox';
import { doAddToast } from '@store/ui/actions';
import { selectCurrentNetworkUrl } from '@store/ui/selectors';

let errorCount = 0;

export const setIdentity = createAction<IdentityPayload>('account/identity/set');
export const generateIdentity = createAsyncThunk<IdentityPayload>(
  'account',
  // @ts-ignore
  async (thing, { dispatch }) => {
    const identity = await doGenerateIdentity();
    identityStorage.set('debug_identity', identity);
    setTimeout(() => {
      dispatch(
        doAddToast({
          id: 'address-toast',
          tone: 'positive',
          message: 'Identity generated',
          description: `
      An identity with testnet ${truncateMiddle(identity.address)} address has been generated!`,
        })
      );
    }, 300);
    return identity;
  }
);

export const eraseIdentity = createAction('account/identity/erase');

export const fetchAccount = createAsyncThunk<AccountPayload, string>(
  'account/fetch',
  // @ts-ignore
  async (principal, { rejectWithValue, dispatch, getState }) => {
    // @ts-ignore
    const apiServer = selectCurrentNetworkUrl(getState());
    try {
      const resp = await fetchFromApi(apiServer)(`/v2/accounts/${principal}`, {
        credentials: 'omit',
      });
      if (!resp.ok) {
        dispatch(
          doAddToast({
            tone: 'critical',
            message: `Status ${resp.status}`,
            description: resp.statusText,
            id: `account-error-${errorCount++}`,
          })
        );
        return rejectWithValue({
          name: `Status ${resp.status}`,
          message: resp.statusText,
        });
      }
      const data = await resp.json();
      return {
        balance: new BN(data.balance.slice(2), 16).toString(),
        nonce: data.nonce,
        principal,
      };
    } catch (e) {
      setTimeout(() => {
        dispatch(
          doAddToast({
            tone: 'critical',
            message: 'Account error',
            description: `Could not get account balance, reason: ${e.message}.`,
            id: `account-error-${errorCount++}`,
          })
        );
      }, 200);
      return rejectWithValue({
        name: 'Error!',
        message: e.message,
      });
    }
  }
);

export const requestFaucetFunds = createAsyncThunk<Account, string>(
  'account/faucet',
  // @ts-ignore
  async (principal, { rejectWithValue, getState }) => {
    // @ts-ignore
    const apiServer = selectCurrentNetworkUrl(getState());
    const res = await postToSidecar(apiServer)(`/debug/faucet?address=${principal}`);
    if (!res.ok) {
      return rejectWithValue({
        name: `Status ${res.status}`,
        message: res.statusText,
      });
    }
    const data: FaucetResponse = await res.json();
    return {
      principal,
      transactions: [data],
    };
  }
);

export const broadcastTransaction = createAsyncThunk<
  Account,
  { principal: string; tx: StacksTransaction }
>(
  'account/broadcast-transaction',
  // @ts-ignore
  async ({ principal, tx }, { rejectWithValue, getState }) => {
    // @ts-ignore
    const apiServer = selectCurrentNetworkUrl(getState());
    try {
      const res = await broadcastTransactionBase(tx, network(apiServer));
      if (res.includes('error')) {
        const error = JSON.parse(res);
        return rejectWithValue(error);
      }
      return {
        principal,
        transactions: [{ txId: `0x${res.toString().split('"')[1]}` }],
      };
    } catch (e) {
      if (e.toString().includes('fetch')) {
        return rejectWithValue({
          name: 'Failed to fetch',
          message: 'Could not post to API.',
        });
      }
      return rejectWithValue(e);
    }
  }
);

export const clearAccountError = createAction('account/clear-error');
