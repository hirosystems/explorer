import { searchFocusedState } from '@store/recoil/search';
import { useRecoilFocus } from '@common/hooks/use-recoil-focus';

export const useSearchFocus = () => {
  const results = useRecoilFocus(searchFocusedState);
  return [...results];
};
