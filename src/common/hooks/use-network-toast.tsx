import { useEffect } from 'react';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';
import { useNetworkMode } from '@common/hooks/use-network-mode';
import { useNetwork } from '@common/hooks/use-network';

export const useNetworkToast = (error?: boolean) => {
  const router = useRouter();
  const networkMode = useNetworkMode();
  const { handleSetTestnet, handleSetMainnet } = useNetwork();

  useEffect(() => {
    const chainMode = router.query.chain;
    if (error || !chainMode || chainMode === networkMode) return;
    if (chainMode === 'testnet') {
      handleSetTestnet();
    } else {
      handleSetMainnet();
    }
  }, []);

  useEffect(() => {
    const chainMode = router.query.chain;
    toast(`You're viewing the ${networkMode || chainMode} Explorer`);
  }, []);
};
