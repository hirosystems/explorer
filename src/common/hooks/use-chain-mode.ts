import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useModal } from '@common/hooks/use-modal';
import { useNetworkMode } from '@common/hooks/use-network-mode';
import { IS_BROWSER } from '@common/constants';
import { NetworkMode, NetworkModes } from '@common/types/network';

import { showDifferentNetworkModalState, networkSwitchingState } from '@store/recoil/network';
import { useAtomValue } from 'jotai/utils';
import { useNetwork } from '@common/hooks/use-network';

type ChainMode = NetworkMode | undefined;
type SetChainMode = (mode: ChainMode) => Promise<void>;

// kind of like useState, but for the query param state
export const useChainMode = (): [ChainMode, SetChainMode] => {
  const router = useRouter();

  const setChainMode = async (chain: ChainMode) => {
    const params = router.query || {};

    if (router.query.chain) {
      delete params.chain;
    }
    await router.replace(
      {
        pathname: router.pathname,
        query: {
          ...params,
          chain,
        },
      },
      `${router.pathname}?chain=${chain}`,
      { shallow: true }
    );
  };

  return [router.query.chain as ChainMode, setChainMode];
};

// checks if there is a chain query param
// if not, add the current mode
// if there is, but not one of two options, set current mode
export const useChainModeEffect = (providedNetworkMode?: NetworkMode) => {
  const router = useRouter();
  const { handleOpenDifferentNetworkModal } = useModal();
  const _networkMode = useNetworkMode();
  const [chainMode, setChainMode] = useChainMode();
  const networkModeChangeState = useAtomValue(networkSwitchingState);
  const showModalState = useAtomValue(showDifferentNetworkModalState);

  const isRegtest = chainMode === NetworkModes.Regtest;
  const isTestnet = chainMode === NetworkModes.Testnet;
  const isMainnet = chainMode === NetworkModes.Mainnet;
  const networkMode = providedNetworkMode || _networkMode;

  useEffect(() => {
    if (IS_BROWSER && networkMode && networkModeChangeState !== 'pending') {
      if (!chainMode || (!isTestnet && !isMainnet && !isRegtest)) {
        void setChainMode(networkMode);
      }
    }
  }, [chainMode, networkMode, IS_BROWSER, networkModeChangeState]);

  useEffect(() => {
    if (showModalState) {
      // alert if url is different than what is returned by api server
      // in the future we can have the modal display all servers added that match a given chain id
      handleOpenDifferentNetworkModal();
    }
  }, [showModalState]);

  useEffect(() => {
    if (!router.query['chain'] && networkMode) {
      router.query['chain'] = networkMode as string;
      void router.push(router);
    }
  }, [router.query, networkMode]);
};

// sometimes you just need the setter
// so you don't have to do `const [_, setter] = hook();`
export const useSetChainMode = (): SetChainMode => {
  return useChainMode()[1];
};
