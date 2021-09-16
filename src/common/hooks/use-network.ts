import { useCallback } from 'react';
import {
  customNetworksListState,
  networkIndexState,
  networkListState,
} from '@store/recoil/network';
import { networkSwitchingState } from '@store/recoil/network';
import { useAtomCallback, useAtomValue, useUpdateAtom } from 'jotai/utils';
import { useAtom } from 'jotai';

export const useNetwork = () => {
  const [customNetworkList, setCustomNetworksList] = useAtom(customNetworksListState);
  const networkList = useAtomValue(networkListState);
  const [currentNetworkIndex, setCurrentNetworkIndex] = useAtom(networkIndexState);
  const [networkSwitching, setNetworkSwitching] = useAtom(networkSwitchingState);

  const handleSetPendingChange = () => {
    console.log('set pending');
    void setNetworkSwitching('pending');
  };

  const handleUpdateCurrentIndex = useAtomCallback<void, number>(
    useCallback((get, set, arg) => {
      void set(networkSwitchingState, 'pending');
      void set(networkIndexState, arg);
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }, [])
  );

  const handleAddNetwork = useAtomCallback<void, { label: string; url: string }>(
    useCallback((get, set, arg) => {
      void set(customNetworksListState, [...customNetworkList, arg]);
      void handleUpdateCurrentIndex(networkList.length);
    }, [])
  );

  const handleRemoveNetwork = useAtomCallback<void, { label: string; url: string }>(
    useCallback((get, set, arg) => {
      const networkListSet = new Set(customNetworkList);
      networkListSet.delete(arg);
      Array.from(networkListSet);
      void set(customNetworksListState, Array.from(networkListSet));
      void handleUpdateCurrentIndex(0);
    }, [])
  );

  const isSwitching = networkSwitching === 'pending';

  return {
    networkList,
    setCustomNetworksList,
    currentNetworkIndex,
    setCurrentNetworkIndex,
    isSwitching,
    handleUpdateCurrentIndex,
    handleAddNetwork,
    handleRemoveNetwork,
    handleSetPendingChange,
  };
};
