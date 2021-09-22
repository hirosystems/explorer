import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAtomValue } from 'jotai/utils';
import { useNetworkMode } from '@common/hooks/use-network-mode';
import { IS_BROWSER } from '@common/constants';
import { NetworkMode } from '@common/types/network';
import { networkSwitchingState } from '@store/recoil/network';

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
  const { networkMode } = useNetworkMode();
  const [chainMode, setChainMode] = useChainMode();
  const networkModeChangeState = useAtomValue(networkSwitchingState);
  const localNetworkMode = providedNetworkMode || networkMode;

  useEffect(() => {
    if (IS_BROWSER && localNetworkMode && networkModeChangeState !== 'pending') {
      if (!chainMode) {
        void setChainMode(localNetworkMode);
      }
    }
  }, [IS_BROWSER, localNetworkMode, networkModeChangeState]);

  useEffect(() => {
    if (!router.query['chain'] && localNetworkMode) {
      router.query['chain'] = localNetworkMode as string;
      void router.push(router);
    }
  }, [router.query, localNetworkMode]);
};

// sometimes you just need the setter
// so you don't have to do `const [_, setter] = hook();`
export const useSetChainMode = (): SetChainMode => {
  return useChainMode()[1];
};
