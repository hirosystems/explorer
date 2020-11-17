import { createAsyncThunk, createAction } from '@reduxjs/toolkit';
import { fetchBlock, fetchBlocksList, FetchBlocksListOptions } from '@common/api/blocks';
import { selectCurrentNetworkUrl } from '@store/ui/selectors';
import { ThunkApiConfig } from '@common/redux';
import { Block } from '@blockstack/stacks-blockchain-api-types';

export const doFetchBlocks = createAsyncThunk<
  Block[],
  Partial<Omit<FetchBlocksListOptions, 'apiServer'>> | void,
  ThunkApiConfig
>('blocks/fetch/list', async (options = {}, { getState }) => {
  const apiServer = selectCurrentNetworkUrl(getState());
  const { results } = await fetchBlocksList({
    apiServer: apiServer as string,
    ...options,
  })();
  return results;
});

export const doFetchBlock = createAsyncThunk<Block, string, ThunkApiConfig>(
  'blocks/fetch/single',
  async (hash, { rejectWithValue, getState }) => {
    const apiServer: string = selectCurrentNetworkUrl(getState()) as string;
    if (!hash) return rejectWithValue({ name: 'Error!', message: 'No hash provided' });
    const block = await fetchBlock({
      apiServer: apiServer,
    })({ hash });
    return block;
  }
);

export const clearBlocksError = createAction('blocks/clear-error');
