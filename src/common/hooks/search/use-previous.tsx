import * as React from 'react';
import { useApiServer } from '@common/hooks/use-api';
import { useRecoilState, useRecoilValue } from 'recoil';
import { searchQueryState, searchResultsState } from '@store/search';
import { fetchSearchResults } from '@common/hooks/search/utils';
import useSWR from 'swr';

export const usePrevious = () => {
  const apiServer = useApiServer();

  const query = useRecoilValue(searchQueryState);
  const [previous, setPrevious] = useRecoilState(searchResultsState);
  const swr = useSWR(query, fetchSearchResults(apiServer), {
    refreshInterval: undefined,
    onSuccess: data => setPrevious(data),
  });

  return { ...swr, data: previous, setPrevious };
};
