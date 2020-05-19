import { createAsyncThunk, createAction } from '@reduxjs/toolkit';
import { Contract } from '@models/contract.interface';
import { fetchContract as fetchContractFromApi } from '@common/api/contracts';
import { selectCurrentNetworkUrl } from '@store/ui/selectors';

export const fetchContract = createAsyncThunk<Contract, string>(
  'contracts/fetch',
  async (query, { getState }) =>
    fetchContractFromApi(selectCurrentNetworkUrl(getState() as any) as string)(query)
);

export const clearContractsError = createAction('contracts/clear-error');
