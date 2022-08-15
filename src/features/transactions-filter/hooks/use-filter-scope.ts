import { useRouter } from 'next/router';
import { TxFilterTypes } from '@features/transactions-filter/transactions-filter-slice';

const pathnameFilterScopeMap: Record<string, TxFilterTypes> = {
  '/transactions': TxFilterTypes.TxsPageTxFilter,
  '/txid/[txid]': TxFilterTypes.TxPageTxFilter,
  '/address/[principal]': TxFilterTypes.AddressTxFilter,
  '/block/[hash]': TxFilterTypes.BlocksPageTxFilter,
  '/microblock/[hash]': TxFilterTypes.BlocksPageTxFilter,
  '/sandbox/[...param]': TxFilterTypes.SandboxTxFilter,
  '/': TxFilterTypes.HomepageTxFilter,
};

export const useFilterScope = () => {
  const router = useRouter();
  const filterScope = pathnameFilterScopeMap[router.pathname];
  return filterScope;
};
