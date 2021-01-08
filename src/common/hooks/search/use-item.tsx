import * as React from 'react';
import { useApiServer } from '@common/hooks/use-api';
import { SearchResult } from '@common/types/search';
import { useRecoilState } from 'recoil';
import { searchResultItemState } from '@store/search';
import { usePrevious } from '@common/hooks/search/use-previous';
import useSWR from 'swr';
import { getFetcher } from '@common/hooks/search/utils';

export const useItem = (resultsData?: SearchResult): [any, boolean] => {
  const apiServer = useApiServer();
  const { data } = usePrevious();

  const searchResultsData =
    (resultsData?.found && resultsData.result) || (data?.found && data?.result);

  const [_, setItem] = useRecoilState(
    searchResultItemState(searchResultsData && searchResultsData?.entity_id)
  );

  const { data: item, isValidating } = useSWR(
    searchResultsData
      ? [searchResultsData.entity_id, searchResultsData.entity_type, apiServer]
      : null,
    getFetcher,
    {
      refreshInterval: undefined,
      onSuccess: data => setItem(data as any),
    }
  );

  return [item || _, isValidating];
};
