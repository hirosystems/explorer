'use client';

import { useApi } from '@/common/api/client';
import { useGlobalContext } from '@/common/context/useAppContext';
import { TransactionQueryKeys, transactionQK } from '@/features/transaction/query-keys';
import { getTransactionQueries } from '@/features/transaction/use-transaction-queries';
import { FC } from 'react';
import { useQuery } from 'react-query';

import { DefaultView } from '../../components/ContractCall/DefaultView';
import { SelectedContractView } from '../../components/ContractCall/SelectedContractView';

const ContractCall: FC<any> = ({ params: { params } }) => {
  const contractId = params?.[0] || '';
  const functionName = params?.[1] || '';
  const { infoApi } = useApi();
  const { data: poxInfo } = useQuery('pox-info', () => infoApi.getPoxInfo(), { staleTime: 5000 });
  const rootContractAddress = poxInfo?.contract_id?.split('.')?.[0];
  const { url: activeNetworkUrl } = useGlobalContext().activeNetwork;

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
