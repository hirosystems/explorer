import { createAsyncThunk } from '@reduxjs/toolkit';
import { Transaction } from '@models/transaction.interface';
import { fetchContract } from '@common/api/contracts';
import { fetchTx } from '@common/api/transactions';

export const fetchTransaction = createAsyncThunk<Transaction, string>(
  'transaction/fetch',
  async query => {
    if (query.includes('.')) {
      // The user is searching by contract name
      const { tx_id } = await fetchContract(query);
      return fetchTx(tx_id);
    }
    // searching by a valid id hash
    return fetchTx(query);
  }
);
