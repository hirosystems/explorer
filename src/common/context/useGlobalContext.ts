'use client';

import { useContext } from 'react';

import { GlobalContext } from './GlobalContextProvider';

export const useGlobalContext = () => {
  return useContext(GlobalContext);
};
