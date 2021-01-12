import { useCallback } from 'react';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { customNetworksListState, networkIndexState, networkListState } from '@store/network';
import { useRouter } from 'next/router';
import { DEFAULT_TESTNET_INDEX, DEFAULT_MAINNET_INDEX } from '@common/constants';

export const useNetwork = () => {
  const router = useRouter();
  const setList = useSetRecoilState(customNetworksListState);
  const list = useRecoilValue(networkListState);
  const [index, setIndex] = useRecoilState(networkIndexState);

  const handleAddListItem = useCallback(
    (item: { label: string; url: string }) =>
      setList(list => {
        const listSet = new Set(list);
        listSet.add(item);
        return [...listSet];
      }),
    []
  );

  const handleRemoveListItem = useCallback(
    (item: { label: string; url: string }) =>
      setList(list => {
        const listSet = new Set(list);
        listSet.delete(item);
        return [...listSet];
      }),
    []
  );

  const handleUpdateCurrentIndex = useCallback((newIndex: number) => {
    setIndex(newIndex);
  }, []);

  const handleAddNetwork = useCallback(
    (item: { label: string; url: string }) => {
      handleAddListItem(item);
      handleUpdateCurrentIndex(list.length);
      router.reload();
    },
    [list, handleAddListItem, handleUpdateCurrentIndex]
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
    list,
    setList,
    index,
    setIndex,
    handleAddListItem,
    handleUpdateCurrentIndex,
    handleSetTestnet,
    handleSetMainnet,
    handleAddNetwork,
    handleRemoveNetwork,
  };
};
