import { usePathname } from 'next/navigation';

import { TxFilterAndSortTypes } from './txsFilterAndSortSlice';

const pathnameFilterScopeMap: Record<string, TxFilterAndSortTypes> = {
  '/transactions': TxFilterAndSortTypes.TxsPageTxFilter,
  '/txid/': TxFilterAndSortTypes.TxPageTxFilter,
  '/address/': TxFilterAndSortTypes.AddressTxFilter,
  '/block/': TxFilterAndSortTypes.BlocksPageTxFilter,
  '/microblock/': TxFilterAndSortTypes.BlocksPageTxFilter,
  '/sandbox/deploy': TxFilterAndSortTypes.SandboxTxFilter,
  '/sandbox/contract-call': TxFilterAndSortTypes.SandboxTxFilter,
  '/sandbox/faucet': TxFilterAndSortTypes.SandboxTxFilter,
  '/sandbox/transfer': TxFilterAndSortTypes.SandboxTxFilter,
  '/': TxFilterAndSortTypes.HomepageTxFilter,
};

export const useFilterAndSortScope = (): TxFilterAndSortTypes => {
  const path = usePathname() || '/';
  const key = Object.keys(pathnameFilterScopeMap).find(key => path.startsWith(key));
  if (!key) return TxFilterAndSortTypes.HomepageTxFilter;
  return pathnameFilterScopeMap[key];
};
