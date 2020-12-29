import * as React from 'react';
import useSWR from 'swr';

import { handleTxIdValidation } from '@common/utils';
import { fetchTransaction, FetchTransactionResponse } from '@common/api/transactions';
import { useApiServer } from '@common/hooks/use-api';

export const useTransactionPageData = ({
  txid,
  initialData,
}: {
  txid: string;
  initialData: FetchTransactionResponse;
}) => {
  const apiServer = useApiServer();
  const { success } = handleTxIdValidation(txid);

  const initialPendingTx =
    'transaction' in initialData ? initialData?.transaction?.tx_status === 'pending' : success;

  const [isPending, setPending] = React.useState(initialPendingTx);

  const { data, error } = useSWR(
    [txid, 'useTransactionPageData'],
    () => fetchTransaction(apiServer)(txid),
    {
      initialData,
      revalidateOnFocus: isPending,
      revalidateOnMount: isPending,
      revalidateOnReconnect: isPending,
    }
  );

  const transaction =
    // @ts-ignore
    (!data.error && data?.transaction) || (!initialData.error && initialData.transaction);

  React.useEffect(() => {
    if (!initialPendingTx && isPending && transaction?.tx_status !== 'pending') {
      setPending(false);
    }
  }, [data, transaction?.tx_status, isPending]);

  return { data, transaction, error, isPending };
};
