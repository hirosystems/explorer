import * as React from 'react';

import { useRecoilState } from 'recoil';
import { searchRecentlyViewedItemsState } from '@store/search';
import { SearchResult } from '@common/types/search';

export const useRecentlyViewedItems = () => {
  const [recentItems, setRecentItems] = useRecoilState(searchRecentlyViewedItemsState);

  const handleUpsertItem = React.useCallback(
    data => {
      setRecentItems({
        ...recentItems,
        [data.result.entity_id]: { ...data, viewedDate: new Date().toISOString() },
      });
    },
    [recentItems, setRecentItems]
  );

  return {
    handleUpsertItem,
    recentItems,
    recentItemsArray: Object.values(recentItems) as SearchResult[],
    setRecentItems,
  };
};
