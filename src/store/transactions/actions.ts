import { createAsyncThunk } from '@reduxjs/toolkit';
import { Transaction } from '@models/transaction.interface';
import { fetchTx } from '@common/api/transactions';

export const fetchTransaction = createAsyncThunk<Transaction, Transaction['tx_id']>(
  'transaction/fetch',
  async txid => fetchTx(txid)
);
