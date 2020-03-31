import engine from 'store/src/store-engine';
import lclStorage from 'store/storages/localStorage';

export const store = engine.createStore([lclStorage]);

export const dedupe = (array: string[]) => [...new Set(array)];

export const toSnakeCase = (str: string) => {
  if (!str) return '';
  const hasSpaces = str.includes(' ');
  const hasUnderscore = str.includes('_');
  let string = str;
  if (hasSpaces) {
    string = string.replace(' ', '-');
  }
  if (hasUnderscore) {
    string = string.replace('_', '-');
  }

  return string.toLowerCase();
};
