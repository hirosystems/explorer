import { createAction } from '@reduxjs/toolkit';
import { Transaction } from '@models/transaction.interface';

export const fetchTransaction = createAction<{ txid: number }>('ADD_TRANSACTION');
export const fetchTransactionDone = createAction<Transaction>('ADD_TRANSACTION_DONE');
export const fetchTransactionFailed = createAction<{ txid: string }>('ADD_TRANSACTION_FAILED');
