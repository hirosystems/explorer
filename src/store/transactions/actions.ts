import { createAction } from '@reduxjs/toolkit';

export const fetchTransaction = createAction<{ txid: number }>('ADD_TRANSACTION');
export const fetchTransactionDone = createAction<{ transaction: any }>('ADD_TRANSACTION_DONE');
