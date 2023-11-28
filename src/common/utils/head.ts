import { TxStatus } from '../types/tx';

export const useFaviconName = (txStatus?: TxStatus) => {
  const suffix = txStatus === 'pending' ? 'pending' : txStatus === 'failed' ? 'failed' : 'success';
  return `favicon${txStatus ? `-${suffix}` : ''}`;
};
