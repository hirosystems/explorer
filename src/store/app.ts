import { atom, AtomEffect, selector } from 'recoil';
import type { ColorModeString } from '@stacks/ui';
import { setDocumentStyles, THEME_STORAGE_KEY } from '@stacks/ui';

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
