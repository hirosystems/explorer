import { useCallback, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useModal } from '@common/hooks/use-modal';
import { useNetworkMode } from '@common/hooks/use-network-mode';
import { IS_BROWSER } from '@common/constants';
import { NetworkMode, NetworkModes } from '@common/types/network';
import { useAuthState } from '@common/hooks/use-auth';

type ChainMode = NetworkMode | undefined;
type SetChainMode = (mode: ChainMode) => Promise<void>;

// kind of like useState, but for the query param state
export const useChainMode = (): [ChainMode, SetChainMode] => {
  const router = useRouter();
  const { setAuthResponse } = useAuthState();

  const setChainMode = async (chain: ChainMode) => {
    const params = router.query || {};
    if (router.query.authResponse) {
      setAuthResponse(params.authResponse as string);
      delete params.authResponse;
    }

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
      {
        pathname: router.pathname,
        query: {
          ...params,
          chain,
        },
      }
    );
  };

  return [router.query.chain as ChainMode, setChainMode];
};

// checks if there is a chain query param
// if not, add the current mode
// if there is, but not one of two options, set current mode
export const useChainModeEffect = () => {
  const { handleOpenDifferentNetworkModal } = useModal();
  const networkMode = useNetworkMode();
  const [chainMode, setChainMode] = useChainMode();

  const isTestnet = chainMode === NetworkModes.Testnet;
  const isMainnet = chainMode === NetworkModes.Mainnet;

  useEffect(() => {
    if (IS_BROWSER && networkMode) {
      if (!chainMode || (!isTestnet && !isMainnet)) {
        void setChainMode(networkMode);
      }
    }
  }, [chainMode, networkMode, IS_BROWSER]);

  useEffect(() => {
    if (IS_BROWSER) {
      if (chainMode && chainMode !== networkMode) {
        // alert if url is different than what is returned by api server
        // in the future we can have the modal display all servers added that match a given chain id
        handleOpenDifferentNetworkModal();
      }
    }
  }, [networkMode, IS_BROWSER]);
};

// sometimes you just need the setter
// so you don't have to do `const [_, setter] = hook();`
export const useSetChainMode = (): SetChainMode => {
  return useChainMode()[1];
};
