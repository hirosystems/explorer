import { useCallback } from 'react';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import {
  customNetworksListState,
  networkIndexState,
  networkListState,
  networkSwitchingState,
} from '@store/network';
import { DEFAULT_TESTNET_INDEX, DEFAULT_MAINNET_INDEX } from '@common/constants';

export const useNetwork = () => {
  const setNetworkList = useSetRecoilState(customNetworksListState);
  const networkList = useRecoilValue(networkListState);
  const [currentNetworkIndex, setIndex] = useRecoilState(networkIndexState);
  const setNetworkSwitching = useSetRecoilState(networkSwitchingState);

  const handleSetPendingChange = () => {
    setNetworkSwitching('pending');
  };

  const handleAddListItem = useCallback(
    (item: { label: string; url: string }) =>
      setNetworkList(list => {
        const networkListSet = new Set(list);
        networkListSet.add(item);
        return [...networkListSet];
      }),
    []
  );

  const handleRemoveListItem = useCallback(
    (item: { label: string; url: string }) =>
      setNetworkList(list => {
        const networkListSet = new Set(list);
        networkListSet.delete(item);
        return [...networkListSet];
      }),
    []
  );

  const handleUpdateCurrentIndex = useCallback((newIndex: number) => {
    setIndex(newIndex);
    handleSetPendingChange();
    setTimeout(() => {
      window.location.reload(true);
    }, 1000);
  }, []);

  const handleAddNetwork = useCallback(
    (item: { label: string; url: string }) => {
      handleAddListItem(item);
      handleUpdateCurrentIndex(networkList.length);
    },
    [networkList, handleAddListItem, handleUpdateCurrentIndex]
  );

  const handleRemoveNetwork = useCallback(
    (item: { label: string; url: string }) => {
      handleRemoveListItem(item);
    },
    [handleRemoveListItem]
  );

  const handleSetTestnet = useCallback(() => {
    handleUpdateCurrentIndex(DEFAULT_TESTNET_INDEX);
  }, [handleUpdateCurrentIndex]);

  const handleSetMainnet = useCallback(() => {
    handleUpdateCurrentIndex(DEFAULT_MAINNET_INDEX);
  }, [handleUpdateCurrentIndex]);

  return {
    networkList,
    setNetworkList,
    currentNetworkIndex,
    setIndex,
    handleAddListItem,
    handleUpdateCurrentIndex,
    handleSetTestnet,
    handleSetMainnet,
    handleAddNetwork,
    handleRemoveNetwork,
  };
};
