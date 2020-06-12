import { createAsyncThunk, createAction } from '@reduxjs/toolkit';
import { Transaction } from '@models/transaction.interface';
import { Contract } from '@models/contract.interface';
import { fetchTx } from '@common/api/transactions';
import { queryWith0x } from '@common/utils';
import { fetchContract } from '@store/contracts';
import { selectCurrentNetworkUrl } from '@store/ui/selectors';

export const fetchTransaction = createAsyncThunk<Transaction[], string>(
  'transaction/fetch',
  async (query, { dispatch, rejectWithValue, getState }) => {
    // @ts-ignore
    const apiServer = selectCurrentNetworkUrl(getState());
    if (!query) return rejectWithValue({ name: 'Error!', message: 'No query provided' });
    const txs = [];
    if (query.includes('.')) {
      const action = await dispatch(fetchContract(query));
      const tx = await fetchTx(apiServer as string)((action.payload as Contract).tx_id);
      txs.push(tx);
      if (tx.tx_type === 'contract_call') {
        const originAction = await dispatch(fetchContract(tx.contract_call.contract_id));
        const originTx = await fetchTx(apiServer as string)(
          (originAction.payload as Contract).tx_id
        );
        txs.push(originTx);
      }
      return txs;
    }
    // searching by a valid id hash
    const tx = await fetchTx(apiServer as string)(queryWith0x(query));
    txs.push(tx);
    if (tx.tx_type === 'contract_call') {
      const originAction = await dispatch(fetchContract(tx.contract_call.contract_id));
      const originTx = await fetchTx(apiServer as string)((originAction.payload as Contract).tx_id);
      txs.push(originTx);
    }
    return txs;
  }
);

export const clearTransactionsError = createAction('transaction/clear-error');
