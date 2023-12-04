'use client';

import { useContext } from 'react';

import { GlobalContext } from './GlobalContext';

export const useGlobalContext = () => {
  return useContext(GlobalContext);
};
