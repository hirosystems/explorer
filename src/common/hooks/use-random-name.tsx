import React from 'react';
import { uniqueNamesGenerator, Config, adjectives, colors, animals } from 'unique-names-generator';

const customConfig: Config = {
  dictionaries: [adjectives, colors, animals],
  separator: '-',
  length: 3,
};

export const generateRandomName = () => uniqueNamesGenerator(customConfig);

export const useRandomName = () => {
  return React.useCallback(generateRandomName, []);
};
