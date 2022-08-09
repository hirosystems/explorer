import { useRouter } from 'next/router';
import { TxFilterTypes } from '@features/transactions-filter/transactions-filter-slice';

export const useFilterScope = () => {
  const router = useRouter();
  const filterScope =
    router.pathname === '/transactions'
      ? TxFilterTypes.TransactionsPageTxFilter
      : router.pathname === '/address/[principal]'
      ? TxFilterTypes.AddressTxFilter
      : TxFilterTypes.HomepageTxFilter;
  return filterScope;
};
