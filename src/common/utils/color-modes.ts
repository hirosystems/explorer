export type ColorModeString = 'dark' | 'light';
export const THEME_STORAGE_KEY = 'theme';

export const getInvertedValue = (string: ColorModeString) =>
  string === 'light' ? 'dark' : 'light';

export const setDocumentStyles = (value: ColorModeString) => {
  if (typeof document !== 'undefined') {
    document.documentElement.classList.add(value);
    document.documentElement.classList.remove(getInvertedValue(value));
    document.documentElement.style.background = getComputedStyle(
      document.documentElement
    ).getPropertyValue('--colors-bg');
  }
};
