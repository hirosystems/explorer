import * as React from 'react';
import { useRecoilState } from 'recoil';
import type { ColorModeString } from '@stacks/ui';
import { getInvertedValue } from '@stacks/ui';
import { colorModeState } from '@store/app';

export const useColorMode = (): [colorMode: ColorModeString, toggleColorMode: () => void] => {
  const [colorMode, setColorMode] = useRecoilState(colorModeState);
  const toggleColorMode = () => setColorMode(getInvertedValue);

  return [colorMode, toggleColorMode];
};
