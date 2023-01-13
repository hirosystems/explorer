import { useContext } from 'react';

import { GlobalContext } from './GlobalContext';

export const useGlobalContext = () => {
  const globalContextProps = useContext(GlobalContext);

  return globalContextProps;
};
