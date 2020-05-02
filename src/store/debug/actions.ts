import { createAsyncThunk, createAction } from '@reduxjs/toolkit';
import { toBN } from '@blockstack/rpc-client';
import { Account, AccountPayload, FaucetResponse, IdentityPayload } from '@store/debug/types';
import { fetchFromRootApi, postToRootApi } from '@common/api/fetch';
import { identityStorage } from '@common/utils';
import { doGenerateIdentity } from '@common/debug';
import {
  StacksTransaction,
  makeSTXTokenTransfer,
  broadcastTransaction as broadcastTransactionBase,
} from '@blockstack/stacks-transactions';
import { network } from '@common/debug';

export const setIdentity = createAction<IdentityPayload>('account/identity/set');
export const generateIdentity = createAsyncThunk<IdentityPayload>(
  'account',
  // @ts-ignore
  async () => {
    const identity = await doGenerateIdentity();
    identityStorage.set('debug_identity', identity);
    return identity;
  }
);

export const eraseIdentity = createAction('account/identity/erase');

export const fetchAccount = createAsyncThunk<AccountPayload, string>(
  'account/fetch',
  // @ts-ignore
  async (principal, { rejectWithValue }) => {
    const path = `/v2/accounts/${principal}`;
    const resp = await fetchFromRootApi(path, {
      credentials: 'omit',
    });
    if (!resp.ok) {
      return rejectWithValue({
        name: `Status ${resp.status}`,
        message: resp.statusText,
      });
    }
    const data = await resp.json();
    return {
      balance: toBN(data.balance).toNumber(),
      nonce: data.nonce,
      principal,
    };
  }
);

export const requestFaucetFunds = createAsyncThunk<Account, string>(
  'account/faucet',
  // @ts-ignore
  async (principal, { rejectWithValue }) => {
    const res = await postToRootApi(`/sidecar/v1/debug/faucet?address=${principal}`);
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
  async ({ principal, tx }, { rejectWithValue }) => {
    try {
      const res = await broadcastTransactionBase(tx, network);

      if (res.includes('error')) {
        const error = JSON.parse(res);
        return rejectWithValue(error);
      }

      return {
        principal,
        transactions: [{ txId: `0x${res.toString().split('"')[1]}` }],
      };
    } catch (e) {
      console.log(e);
    }
  }
);
