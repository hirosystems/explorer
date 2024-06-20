'use client';

import { useContext } from 'react';

import { GloablContext } from './GlobalContextProvider';

export const useGlobalContext = () => {
  return useContext(GloablContext);
};
