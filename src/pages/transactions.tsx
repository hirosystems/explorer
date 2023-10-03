import { Meta } from '@/components/meta-head';

import AppTransactionsPage from '../appPages/transactions/page';

export default function TransactionsPage() {
  return (
    <>
      <Meta title="Recent transactions" />
      <AppTransactionsPage />
    </>
  );
}
