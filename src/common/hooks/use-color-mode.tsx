import * as React from 'react';
import { atom, AtomEffect, selector, useRecoilState } from 'recoil';
export const THEME_STORAGE_KEY = 'theme';

type ColorModeString = 'dark' | 'light';
const getInvertedValue = (string: ColorModeString) => (string === 'light' ? 'dark' : 'light');
const setDocumentStyles = (value: ColorModeString) => {
  if (typeof document !== 'undefined') {
    document.documentElement.classList.add(value);
    document.documentElement.classList.remove(getInvertedValue(value));
    document.documentElement.style.background = getComputedStyle(
      document.documentElement
    ).getPropertyValue('--colors-bg');
  }
};

export const colorModeAtomEffect = (key: string): AtomEffect<ColorModeString> => ({
  setSelf,
  onSet,
}) => {
  if (typeof window !== 'undefined') {
    const savedValue: ColorModeString | null = localStorage.getItem(key) as ColorModeString | null;

    if (savedValue != null) {
      const value: ColorModeString = savedValue;
      setSelf(value);
      setDocumentStyles(value);
    }
    onSet(newValue => {
      localStorage.setItem(key, newValue as ColorModeString);
      setDocumentStyles(newValue as ColorModeString);
    });
  }
};

export const colorModeState = atom<ColorModeString>({
  key: 'app.color-mode',
  default: selector<ColorModeString>({
    key: 'search.color-mode.default',
    get: () => {
      if (typeof window !== 'undefined') {
        const saved = localStorage.getItem(THEME_STORAGE_KEY);
        if (saved) {
          setDocumentStyles(saved as ColorModeString);
          return saved as ColorModeString;
        }
      }
      setDocumentStyles('light');
      return 'light';
    },
  }),
  effects_UNSTABLE: [colorModeAtomEffect(THEME_STORAGE_KEY)],
});

export const useColorMode = (): [colorMode: ColorModeString, toggleColorMode: () => void] => {
  const [colorMode, setColorMode] = useRecoilState(colorModeState);
  const toggleColorMode = () => setColorMode(getInvertedValue);

  return [colorMode, toggleColorMode];
};
