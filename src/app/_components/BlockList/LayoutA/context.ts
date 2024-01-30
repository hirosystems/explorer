import { Dispatch, SetStateAction, createContext, useContext } from 'react';

interface BlockListContextType {
  isUpdateListLoading: boolean;
  setIsUpdateListLoading: Dispatch<SetStateAction<boolean>>;
  groupedByBtc: boolean;
  setGroupedByBtc: Dispatch<SetStateAction<boolean>>;
  liveUpdates: boolean;
  setLiveUpdates: Dispatch<SetStateAction<boolean>>;
}

export const BlockListContext = createContext<BlockListContextType | undefined>(undefined);

export const useBlockListContext = () => {
  const context = useContext(BlockListContext);
  if (!context) {
    throw new Error('useBlockListContext must be used within a BlockListContextProvider');
  }
  return context;
};
