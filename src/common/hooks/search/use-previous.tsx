import * as React from 'react';
import { useApiServer } from '@common/hooks/use-api';
import { useRecoilState, useRecoilValue } from 'recoil';
import { searchQueryState, searchResultsState } from '@store/search';
import { extractQueryFromKey, fetchSearchResults, makeKey } from '@common/hooks/search/utils';
import useSWR from 'swr';

export const usePrevious = () => {
  const prefix = 'usePrevious';
  const apiServer = useApiServer();

  const query = useRecoilValue(searchQueryState);
  const [previous, setPrevious] = useRecoilState(searchResultsState);
  const key = makeKey(query, prefix);
  const swr = useSWR(
    key,
    value => {
      const _query = extractQueryFromKey(value, prefix);
      if (_query) {
        return fetchSearchResults(apiServer)(_query);
      }
    },
    {
      refreshInterval: undefined,
      onSuccess: (data: any) => setPrevious(data),
    }
  );

  return { ...swr, data: previous, setPrevious };
};
