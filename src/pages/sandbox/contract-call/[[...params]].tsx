import { TransactionQueryKeys, transactionQK } from '@features/transaction/query-keys';
import { getTransactionQueries } from '@features/transaction/use-transaction-queries';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import React from 'react';
import { useQuery } from 'react-query';

import { useApi } from '@common/api/client';
import { useAppSelector } from '@common/state/hooks';
import { selectActiveNetwork } from '@common/state/network-slice';

import { DefaultView } from '@modules/sandbox/components/ContractCall/DefaultView';
import { SelectedContractView } from '@modules/sandbox/components/ContractCall/SelectedContractView';

const ContractCall: NextPage = () => {
  const { query } = useRouter();
  const contractId = query?.params?.[0] || '';
  const functionName = query?.params?.[1] || '';
  const { infoApi } = useApi();
  const { data: poxInfo } = useQuery('pox-info', () => infoApi.getPoxInfo(), { staleTime: 5000 });
  const rootContractAddress = poxInfo?.contract_id?.split('.')?.[0];
  const { url: activeNetworkUrl } = useAppSelector(selectActiveNetwork);

  const queries = getTransactionQueries(activeNetworkUrl);

  const { data: contract } = useQuery(
    transactionQK(TransactionQueryKeys.contract, contractId),
    queries.fetchContract(contractId),
    {
      enabled: !!contractId,
    }
  );

  if (!rootContractAddress) return null;

  if (!!contract) {
    return (
      <SelectedContractView
        contract={contract}
        functionName={functionName}
        contractId={contractId}
      />
    );
  }

  return <DefaultView rootContractAddress={rootContractAddress} />;
};

export default ContractCall;
