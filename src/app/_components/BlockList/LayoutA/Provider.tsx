import { ReactNode, useState } from 'react';

import { BlockListContext } from './context';

export function BlockListProvider({ children }: { children: ReactNode }) {
  const [isUpdateListLoading, setIsUpdateListLoading] = useState(false);
  const [groupedByBtc, setGroupedByBtc] = useState(true);
  const [liveUpdates, setLiveUpdates] = useState(false);

  return (
    <BlockListContext.Provider
      value={{
        isUpdateListLoading,
        setIsUpdateListLoading,
        groupedByBtc,
        setGroupedByBtc,
        liveUpdates,
        setLiveUpdates,
      }}
    >
      {children}
    </BlockListContext.Provider>
  );
}
