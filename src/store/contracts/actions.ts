import { createAsyncThunk, createAction } from '@reduxjs/toolkit';
import { Contract } from '@models/contract.interface';
import { fetchContract as fetchContractFromApi } from '@common/api/contracts';

export const fetchContract = createAsyncThunk<Contract, string>('contracts/fetch', async query =>
  fetchContractFromApi(query)
);

export const clearContractsError = createAction('contracts/clear-error');
