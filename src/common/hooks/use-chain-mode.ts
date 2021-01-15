import { useCallback, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useModal } from '@common/hooks/use-modal';
import { useNetworkMode } from '@common/hooks/use-network-mode';
import { IS_BROWSER } from '@common/constants';
import { NetworkMode, NetworkModes } from '@common/types/network';

type ChainMode = NetworkMode | undefined;
type SetChainMode = (mode: ChainMode) => Promise<void>;

// kind of like useState, but for the query param state
export const useChainMode = (): [ChainMode, SetChainMode] => {
  const router = useRouter();

  const authResponse = router.query?.authResponse
    ? { authResponse: router.query?.authResponse }
    : {};

  const setChainMode = useCallback(
    async (chain: ChainMode) => {
      await router.replace(
        {
          pathname: router.pathname,
          query: {
            ...router.query,
            ...authResponse,
            chain,
          },
        },
        {
          pathname: router.pathname,
          query: {
            chain,
            ...authResponse,
          },
        },
        { shallow: true }
      );
    },
    [router]
  );

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
