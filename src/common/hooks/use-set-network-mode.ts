import { NetworkModes } from '@common/types/network';
import { useMemo } from 'react';
import { setCurrentNetworkMode } from '@common/app-helpers';

export const useSetNetworkMode = (networkMode: NetworkModes) => {
  useMemo(() => {
    setCurrentNetworkMode(networkMode);
  }, []);
};
