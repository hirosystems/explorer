'use client';

import { useContext } from 'react';

import { BlockListContext } from '.';

export const useBlockListContext = () => {
  return useContext(BlockListContext);
};
