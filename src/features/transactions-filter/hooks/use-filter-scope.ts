import { usePathname } from 'next/navigation';
import { TxFilterTypes } from '@/features/transactions-filter/transactions-filter-slice';

const pathnameFilterScopeMap: Record<string, TxFilterTypes> = {
  '/transactions': TxFilterTypes.TxsPageTxFilter,
  '/txid/': TxFilterTypes.TxPageTxFilter,
  '/address/': TxFilterTypes.AddressTxFilter,
  '/block/': TxFilterTypes.BlocksPageTxFilter,
  '/microblock/': TxFilterTypes.BlocksPageTxFilter,
  '/sandbox/deploy': TxFilterTypes.SandboxTxFilter,
  '/sandbox/contract-call': TxFilterTypes.SandboxTxFilter,
  '/sandbox/faucet': TxFilterTypes.SandboxTxFilter,
  '/sandbox/transfer': TxFilterTypes.SandboxTxFilter,
  '/': TxFilterTypes.HomepageTxFilter,
};

export const useFilterScope = (): TxFilterTypes => {
  const path = usePathname() || '/';
  const key = Object.keys(pathnameFilterScopeMap).find(key => path.startsWith(key));
  if (!key) return TxFilterTypes.HomepageTxFilter;
  return pathnameFilterScopeMap[key];
};
