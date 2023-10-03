import { useCallback } from 'react';
import { adjectives, animals, colors, Config, uniqueNamesGenerator } from 'unique-names-generator';

const customConfig: Config = {
  dictionaries: [adjectives, colors, animals],
  separator: '-',
  length: 3,
};

export const generateRandomName = () => uniqueNamesGenerator(customConfig);

export const useRandomName = () => {
  return useCallback(generateRandomName, []);
};
