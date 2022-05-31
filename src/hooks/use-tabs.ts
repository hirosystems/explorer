import { useAtom } from 'jotai';
import { tabIndexState } from '@store/ui';

export const useTabs = (
  key: string
): { currentIndex: number; setCurrentIndex: (a: number) => void } => {
  const [currentIndex, setCurrentIndex] = useAtom(tabIndexState(key));
  return {
    currentIndex,
    setCurrentIndex,
  };
};
