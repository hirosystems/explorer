import * as React from 'react';

import { useRecoilState } from 'recoil';
import { searchDropdownState } from '@store/recoil/search';

export const useSearchDropdown = () => {
  const [searchDropdown, setSearchDropdown] = useRecoilState(searchDropdownState);

  const handleMakeVisible = () => {
    setSearchDropdown('visible');
  };

  const handleMakeHidden = () => {
    setSearchDropdown('hidden');
  };

  const isVisible = searchDropdown === 'visible';
  const isHidden = searchDropdown === 'hidden';

  return {
    isVisible,
    isHidden,
    handleMakeVisible,
    handleMakeHidden,
  };
};
