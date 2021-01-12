import { useCallback } from 'react';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { customNetworksListState, networkIndexState, networkListState } from '@store/network';
import { useRouter } from 'next/router';
import { DEFAULT_TESTNET_INDEX, DEFAULT_MAINNET_INDEX } from '@common/constants';

export const useNetwork = () => {
  const router = useRouter();
  const setNetworkList = useSetRecoilState(customNetworksListState);
  const networkList = useRecoilValue(networkListState);
  const [currentNetworkIndex, setIndex] = useRecoilState(networkIndexState);

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
  }, []);

  const handleAddNetwork = useCallback(
    (item: { label: string; url: string }) => {
      handleAddListItem(item);
      handleUpdateCurrentIndex(networkList.length);
      router.reload();
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
    router.reload();
  }, []);

  const handleSetMainnet = useCallback(() => {
    handleUpdateCurrentIndex(DEFAULT_MAINNET_INDEX);
    router.reload();
  }, []);

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
