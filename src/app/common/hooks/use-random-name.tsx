import React from 'react';
import { Config, adjectives, animals, colors, uniqueNamesGenerator } from 'unique-names-generator';

const customConfig: Config = {
  dictionaries: [adjectives, colors, animals],
  separator: '-',
  length: 3,
};

export const generateRandomName = () => uniqueNamesGenerator(customConfig);

export const useRandomName = () => {
  return React.useCallback(generateRandomName, []);
};
