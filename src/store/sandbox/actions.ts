import { createAsyncThunk, createAction } from '@reduxjs/toolkit';
import BN from 'bn.js';
import { Account, AccountPayload, FaucetResponse, IdentityPayload } from '@store/sandbox/types';
import { fetchFromApi, postToSidecar } from '@common/api/fetch';
import { doGenerateIdentity } from '@common/sandbox';
import {
  StacksTransaction,
  broadcastTransaction as broadcastTransactionBase,
  broadcastRawTransaction,
} from '@stacks/transactions';
import { network } from '@common/sandbox';
import { doAddToast } from '@store/ui/actions';
import { selectCurrentNetworkUrl } from '@store/ui/selectors';
import { UserData, UserSession } from '@stacks/auth';
const storage = require('@stacks/storage');
const Storage = storage.Storage;
import { ThunkApiConfig } from '@common/redux';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import extractJson from 'extract-json-string';

let errorCount = 0;

export const setLocalNonce = createAction<number>('account/user/localNonce/increment');
export const resetLocalNonce = createAction('account/user/localNonce/reset');

export const setIdentity = createAction<IdentityPayload>('account/identity/set');
export const eraseIdentity = createAction('account/identity/erase');
export const setUserData = createAction<UserData>('account/user/set');
export const clearAccountError = createAction('account/clear-error');

export const generateIdentity = createAsyncThunk<IdentityPayload, Storage, ThunkApiConfig>(
  'account/identity',
  async (storage: Storage) => {
    try {
      const saved = await storage.getFile('identity.json');
      return JSON.parse(saved as string) as IdentityPayload;
    } catch (e) {
      // does not exist, so we will generate and upload
      const identity = doGenerateIdentity();
      try {
        await storage.putFile('identity.json', JSON.stringify(identity));
        return identity;
      } catch (e) {
        console.log('putFile error', e);
        return identity;
      }
    }
  }
);

export const fetchAccount = createAsyncThunk<Account, string, ThunkApiConfig>(
  'account/fetch',
  async (principal, { dispatch, getState, rejectWithValue }) => {
    const apiServer = selectCurrentNetworkUrl(getState());
    try {
      const resp = await fetchFromApi(apiServer as string)(`/v2/accounts/${principal}`, {
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
      const data: AccountPayload = await resp.json();
      const account: Account = {
        balance: new BN(data.balance.toString().slice(2), 16).toString(),
        nonce: data.nonce,
        principal,
      };

      return account;
    } catch (e) {
      setTimeout(() => {
        dispatch(
          doAddToast({
            tone: 'critical',
            message: 'Account error',
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/restrict-template-expressions
            description: `Could not get account balance, reason: ${e.message}.`,
            id: `account-error-${errorCount++}`,
          })
        );
      }, 200);
      return rejectWithValue({
        name: 'Error!',
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        message: e.message as string,
      });
    }
  }
);

export const requestFaucetFunds = createAsyncThunk<Partial<Account>, string, ThunkApiConfig>(
  'account/faucet',
  async (principal, thunkAPI) => {
    const { rejectWithValue, getState } = thunkAPI;
    const apiServer = selectCurrentNetworkUrl(getState());
    const res = await postToSidecar(apiServer as string)(`/debug/faucet?address=${principal}`);
    if (!res.ok) {
      return rejectWithValue({
        name: `Status ${res.status}`,
        message: res.statusText,
      });
    }
    const data: FaucetResponse = await res.json();
    const final: Partial<Account> = {
      principal,
      transactions: [data],
    };
    return final;
  }
);

export interface BroadcastTxOptions {
  principal: string;
  tx: StacksTransaction | string;
  isRaw?: boolean;
}

export const broadcastTransaction = createAsyncThunk<
  Partial<Account>,
  BroadcastTxOptions,
  ThunkApiConfig
>('account/broadcast-transaction', async (options, { rejectWithValue, getState }) => {
  const { principal, tx, isRaw } = options;
  const apiServer = selectCurrentNetworkUrl(getState());
  try {
    if (isRaw) {
      const buffer = Buffer.from(tx as string, 'hex');
      const res = await broadcastRawTransaction(
        buffer,
        network(apiServer as string).getBroadcastApiUrl()
      );
      return {
        principal,
        transactions: [{ txId: `0x${res.toString().split('"')[1]}` }],
      } as Partial<Account>;
    } else {
      const res = await broadcastTransactionBase(
        tx as StacksTransaction,
        network(apiServer as string)
      );
      return {
        principal,
        transactions: [{ txId: `0x${res.toString().split('"')[1]}` }],
      } as Partial<Account>;
    }
  } catch (e) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-call
    const realError = extractJson.extract(e?.message)[0];
    if (realError) {
      return rejectWithValue(realError);
    }
    return rejectWithValue(e);
  }
});
