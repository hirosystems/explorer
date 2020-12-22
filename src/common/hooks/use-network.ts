import { useCallback } from 'react';
import { useRecoilState } from 'recoil';
import { networkIndexState, networkListState } from '@store/network';
import { useRouter } from 'next/router';

export const useNetwork = () => {
  const router = useRouter();
  const [list, setList] = useRecoilState(networkListState);
  const [index, setIndex] = useRecoilState(networkIndexState);

  const handleAddListItem = (item: { label: string; url: string }) => {
    setList([...list, item]);
  };

  const handleUpdateCurrentIndex = (newIndex: number) => {
    setIndex(newIndex);
  };

  const handleAddNetwork = useCallback(
    (item: { label: string; url: string }) => {
      handleAddListItem(item);
      handleUpdateCurrentIndex(list.length);
      router.reload();
    },
    [list, handleAddListItem, handleUpdateCurrentIndex]
  );

  return {
    list,
    setList,
    index,
    setIndex,
    handleAddListItem,
    handleUpdateCurrentIndex,
    handleAddNetwork,
  };
};
